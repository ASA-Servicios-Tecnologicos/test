import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';
import { CheckoutService } from '../checkout/services/checkout.service';
import { v4 as uuidv4 } from 'uuid';
import { ManagementService } from 'src/management/services/management.service';
import { AppConfigService } from 'src/configuration/configuration.service';
import { firstValueFrom } from 'rxjs';
import fetch from 'node-fetch';
import { CheckoutDTO } from 'src/shared/dto/checkout.dto';
import { ManagementHttpService } from 'src/management/services/management-http.service';
@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private checkoutService: CheckoutService,
    private managementHttpService: ManagementHttpService,
    private http: HttpService,
    private appConfigService: AppConfigService,
  ) {}

  async create(booking: BookingDTO) {
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (!this.verifyBooking(prebookingData, booking)) {
      throw new HttpException('La información del booking no coincide con el prebooking', 400);
    }

    booking.bookingId = uuidv4();
    const body: CheckoutDTO = {
      booking: {
        bookingId: booking.bookingId,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
        amount: {
          value: booking.amount,
          currency: booking.currency,
        },
        description: booking.hotelName,
        language: booking.language,
        market: booking.market,
        koURL: booking.koUrl,
        okURL: booking.okUrl,
        distribution: booking.distribution,
        cancellationPolicies: booking.cancellationPolicies,
      },
    };

    const checkout = (await this.checkoutService.doCheckout(body))['data'];
    const prebooking: Booking = {
      ...booking,
      bookingId: booking.bookingId,
      checkoutId: checkout.checkoutId,
    };
    const createdBooking = new this.bookingModel(prebooking);
    await createdBooking.save();

    return { bookingId: prebooking.bookingId };
  }

  findById(id: string) {
    return this.bookingModel.findOne({ bookingId: id }).exec();
  }

  async doReservation(id: string) {
    const checkout = await this.checkoutService.getCheckout(id);
    const booking = await this.bookingModel.findOne({ checkoutId: checkout.checkoutId }).exec();
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (prebookingData?.status !== 200) {
      return prebookingData;
    }

    const body = {
      requestToken: prebookingData.data.requestToken,
      providerToken: prebookingData.data.providerToken,
      paxes: this.buildPaxesReserve(booking, checkout.passengers),
      packageClient: {
        bookingData: {
          hashPrebooking: booking.hashPrebooking,
          totalAmount: prebookingData.data.totalAmount,
          hotels: prebookingData.data.hotels,
          flights: prebookingData.data.flights,
          transfers: prebookingData.data.transfers,
          productTokenNewblue: prebookingData.data.productTokenNewblue,
          distributionRooms: prebookingData.data.distributionRooms,
          passengers: prebookingData.data.distributionRooms,
          cancellationPolicyList: prebookingData.data.cancellationPolicyList,
          currency: prebookingData.data.currency,
          distribution: prebookingData.data.distribution,
          providerName: booking.providerName,
        },
      },
    };
    return this.managementHttpService.post(`${this.appConfigService.TECNOTURIS_URL}/packages-providers/api/v1/bookings`, body);
    // TODO: Guardar en el management
  }

  private buildPaxesReserve(booking: Booking, passengers: Array<any>) {
    const paxes = [];
    booking.distribution.forEach((distribution, index) => {
      const passenger = passengers[index];
      if (passenger) {
        const pax = {
          abbreviation: passenger.title,
          name: passenger.name,
          code: parseInt(distribution.extCode),
          ages: distribution.age,
          lastname: passenger.lastname,
          phone: '',
          email: '',
          documentType: 'PAS',
          documentNumber: '',
          birthdate: this.formatBirthdate(passenger.dob),
          documentExpirationDate: '',
          nationality: '',
          phoneNumberCode: 34,
          type: '',
        };
        paxes.push(pax);
      }
    });
    return paxes;
  }

  private formatBirthdate(dob: string) {
    let splitedDate = dob.split('-');
    splitedDate = splitedDate.reverse();
    return splitedDate.join('/');
  }

  private buildPassengersDistributionReserve(booking: Booking) {
    const groupByRoom = this.groupBy(booking.distribution, 'room');
    return groupByRoom.map((distribution, index) => {
      return {
        code: distribution[0].room,
        passengers: distribution.map((passenger) => {
          return {
            holder: false,
            code: passenger.extCode,
            age: passenger.age,
            gender: null,
            name: null,
            surname: null,
            dateOfBirth: null,
            extraData: [],
          };
        }),
      };
    });
  }

  private buildDistribution(booking: Booking) {
    const groupByRoom = this.groupBy(booking.distribution, 'room');
    return groupByRoom.map((distribution) => {
      return {
        rooms: 1,
        adults: distribution.filter((passenger) => passenger.type === 'ADULT').length,
        children: distribution.filter((passenger) => passenger.type === 'CHILD').map((child) => child.age),
      };
    });
  }

  private getPrebookingDataCache(hash: string) {
    return this.managementHttpService.get<any>(`${this.appConfigService.TECNOTURIS_URL}/packages-newblue/api/v1/pre-bookings/${hash}`);
  }

  async getRemoteCheckout(id: string) {
    return await this.checkoutService.getCheckout(id);
  }

  private groupBy(arr, prop) {
    const map = new Map(Array.from(arr, (obj) => [obj[prop], []]));
    arr.forEach((obj) => map.get(obj[prop]).push(obj));
    return Array.from(map.values());
  }

  private verifyBooking(prebooking, booking: BookingDTO | BookingDocument) {
    if (prebooking.data.totalAmount === booking.amount && prebooking.data.hashPrebooking === booking.hashPrebooking) {
      return true;
    }
    return false;
  }
}
