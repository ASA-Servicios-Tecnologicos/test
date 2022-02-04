import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO, DistributionDTO } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';
import { CheckoutService } from '../checkout/services/checkout.service';
import { v4 as uuidv4 } from 'uuid';
import { ManagementService } from 'src/management/services/management.service';
import { AppConfigService } from 'src/configuration/configuration.service';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import fetch from 'node-fetch';
@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private checkoutService: CheckoutService,
    private managementService: ManagementService,
    private http: HttpService,
    private appConfigService: AppConfigService,
  ) {}

  async create(booking: BookingDTO) {
    // TODO: Asignar booking al booking
    // booking.bookingId = uuidv4();
    const checkout = await (
      await this.checkoutService.doCheckout({
        booking: {
          /*  bookingId: booking.bookingId, */
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
      })
    )['data'];
    console.log(checkout);

    // TODO: bookingId tiene que ser el generado por nosotros, cambiar checkoutId por el de la response
    const prebooking: Booking = {
      ...booking,
      bookingId: checkout.booking.bookingId,
      checkoutId: 'CHK-FL-00432423', //checkout.checkoutId,
    };
    const createdBooking = new this.bookingModel(prebooking);
    await createdBooking.save();
    return { bookingId: prebooking.bookingId };
  }

  findById(id: string) {
    return this.bookingModel.findOne({ bookingId: id }).exec();
  }

  async doReservation(id: string) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const checkout = await this.checkoutService.getCheckout(id);
    const booking = await this.bookingModel.findOne({ checkoutId: checkout.checkoutId }).exec();
    const token = await this.managementService.auth();
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking, token);
    console.log(JSON.stringify(prebookingData));
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
          providerName: booking.providerToken,
        },
      },
    };
    return fetch(`${this.appConfigService.TECNOTURIS_URL}/packages-providers/api/v1/bookings`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        throw new HttpException(err.message, err.response.status);
      });
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

  private getPrebookingDataCache(hash: string, token: string) {
    return firstValueFrom(
      this.http.get(`${this.appConfigService.TECNOTURIS_URL}/packages-newblue/api/v1/pre-bookings/${hash}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      }),
    )
      .then((res) => res.data)
      .catch((error) => {
        throw new HttpException(error.message, error.response.status);
      });
  }

  async getRemoteCheckout(id: string) {
    return await this.checkoutService.getCheckout(id);
  }

  private groupBy(arr, prop) {
    const map = new Map(Array.from(arr, (obj) => [obj[prop], []]));
    arr.forEach((obj) => map.get(obj[prop]).push(obj));
    return Array.from(map.values());
  }
}
