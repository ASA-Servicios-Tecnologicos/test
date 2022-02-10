import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO, CreateManagementBookDto } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';
import { CheckoutService } from '../checkout/services/checkout.service';
import { v4 as uuidv4 } from 'uuid';
import { AppConfigService } from 'src/configuration/configuration.service';
import { CheckoutDTO, CheckoutPassenger, CreateCheckoutDTO } from 'src/shared/dto/checkout.dto';
import { ManagementHttpService } from 'src/management/services/management-http.service';
import { PrebookingDTO } from 'src/shared/dto/pre-booking.dto';
import { ManagementBudgetPassengerDTO } from 'src/shared/dto/budget.dto';
import { ClientService } from 'src/management/services/client.service';
import { ExternalClientService } from 'src/management/services/external-client.service';
import { GetManagementClientInfoByUsernameDTO } from 'src/shared/dto/management-client.dto';
@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private checkoutService: CheckoutService,
    private managementHttpService: ManagementHttpService,
    private appConfigService: AppConfigService,
    private clientService: ClientService,
    private externalClientService: ExternalClientService,
  ) {}

  async create(booking: BookingDTO) {
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (!this.verifyBooking(prebookingData, booking)) {
      throw new HttpException('La información del booking no coincide con el prebooking', 400);
    }

    booking.bookingId = uuidv4();
    const body: CreateCheckoutDTO = {
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

  async doBooking(id: string) {
    const checkout = await this.checkoutService.getCheckout(id);
    const booking = await this.bookingModel.findOne({ checkoutId: checkout.checkoutId }).exec();
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (prebookingData?.status !== 200) {
      throw new HttpException(prebookingData.data, prebookingData.status);
    }

    const body = {
      requestToken: prebookingData.data.requestToken,
      providerToken: prebookingData.data.providerToken,
      paxes: [
        {
          abbreviation: 'MR',
          name: 'Pedro',
          code: 1,
          ages: 30,
          lastname: 'Gutierrez',
          phone: '',
          email: '',
          documentType: 'PAS',
          documentNumber: '',
          birthdate: '08/12/1990',
          documentExpirationDate: '',
          nationality: '',
          phoneNumberCode: 34,
          type: '',
        },
        {
          abbreviation: 'MS',
          name: 'Ana',
          code: 2,
          ages: 30,
          lastname: 'Sierra',
          phone: '',
          email: '',
          documentType: 'PAS',
          documentNumber: '',
          birthdate: '08/12/1986',
          documentExpirationDate: '',
          nationality: '',
          phoneNumberCode: 34,
          type: '',
        },
      ] /* this.buildPaxesReserveV2(checkout.passengers) */,
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
    const booked = await this.managementHttpService.post(
      `${this.appConfigService.TECNOTURIS_URL}/packages-providers/api/v1/bookings`,
      body,
    );
    return this.createBookingInManagement(prebookingData, booking, checkout);
  }

  private async createBookingInManagement(prebookingData: PrebookingDTO, booking: Booking, checkOut: CheckoutDTO) {
    const client = await this.getOrCreateClient(checkOut);

    const createBookDTO: CreateManagementBookDto = {
      packageData: [
        {
          ...prebookingData.data,
          uuid: uuidv4(),
          agencyInfo: {
            agentNum: '',
            expediente: '',
          },
          commission: { pvp: prebookingData.data.totalAmount },
          integrationType: 'PACKAGE',
          adults: prebookingData.data.distribution.map((distribution) => distribution.adults).reduce((acc, current) => acc + current, 0),
          children: prebookingData.data.distribution
            .map((distribution) => distribution.children.length)
            .reduce((acc, current) => acc + current, 0),
          infants: 0,
          partialTotal: prebookingData.data.totalAmount,
          passengers: [...[...prebookingData.data.passengers.map((passenger) => passenger.passengers)]],
          providerName: booking.providerName,
          validateMessage: '',
          checkForm: true,
          isSelected: true,
          canBeBooked: true,
          comments: {
            agentComment: '',
            updatedPrice: prebookingData.data.totalAmount,
            clientComment: '',
          },
          flightDurationOutward: this.calcFlightDuration(
            prebookingData.data.flights[0].outward[0].departure.date.toString(),
            prebookingData.data.flights[0].outward[0].arrival.date.toString(),
          ),
          flightDurationReturn: this.calcFlightDuration(
            prebookingData.data.flights[0].return[0].departure.date.toString(),
            prebookingData.data.flights[0].return[0].arrival.date.toString(),
          ),
          infoAirports: {
            airportOriginCity: '',
            airportOriginName: '',
            airportArrivalCity: '',
            airportArrivalName: '',
          },
          paxes: [
            {
              abbreviation: 'MR',
              name: 'Pedro',
              code: 1,
              ages: 30,
              lastname: 'Gutierrez',
              phone: '',
              email: '',
              documentType: 'PAS',
              documentNumber: '',
              birthdate: '08/12/1990',
              documentExpirationDate: '',
              nationality: '',
              phoneNumberCode: 34,
              type: '',
            },
            {
              abbreviation: 'MS',
              name: 'Ana',
              code: 2,
              ages: 30,
              lastname: 'Sierra',
              phone: '',
              email: '',
              documentType: 'PAS',
              documentNumber: '',
              birthdate: '08/12/1986',
              documentExpirationDate: '',
              nationality: '',
              phoneNumberCode: 34,
              type: '',
            },
          ],
        },
      ],
      dossier: null,
      client: client,
    };

    const bookingManagement = await this.managementHttpService.post(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/booking/`,
      createBookDTO,
    );
    return bookingManagement;
  }

  private async getOrCreateClient(checkOut: CheckoutDTO) {
    const client: GetManagementClientInfoByUsernameDTO = await this.clientService
      .getClientInfoByUsername(/* checkOut.contact.email */ 'dani@test.com')
      .catch((error) => {
        if (error.response.status === HttpStatus.BAD_REQUEST) {
          return this.clientService
            .getClientInfoByUsername(/* `+${checkOut.contact.phone.prefix}${checkOut.contact.phone.phone}` */ '+34111111111')
            .catch((error) => {
              if (error.response.status === HttpStatus.BAD_REQUEST) {
                return null;
              }
            });
        }
      });
    if (!client) {
      const integrationClient = await this.clientService.getIntegrationClient();
      //TODO: Create client
      const createdClient = await this.externalClientService.createExternalClient({
        accept_privacy_policy: true,
        agency: integrationClient.agency.id,
        agency_chain: integrationClient.agency.agency_chain_id,
        dni: /* checkOut.buyer.document.documentNumber */ '53733022W',
        email: /* checkOut.contact.email */ 'dani@test.com',
        first_name: /*  checkOut.buyer.name */ 'dani',
        last_name: /* checkOut.buyer.lastname */ 'nieto',
        password1: '123456',
        password2: '123456',
        phone: /* `+${checkOut.contact.phone.prefix}${checkOut.contact.phone.phone}` */ '+34111111111',
        role: 8,
        username: 'dani@test.com',
      });
      return createdClient.client;
    }
    return client.id;
  }

  private calcFlightDuration(departureDate: string, arrivalDate: string) {
    const departure = new Date(departureDate);
    const arrival = new Date(arrivalDate);
    let diffInMilliSeconds = Math.abs(arrival.getTime() - departure.getTime()) / 1000;
    const days = Math.floor(diffInMilliSeconds / 86400);
    const hours = (Math.floor(diffInMilliSeconds / 3600) % 24) + days * 24;
    diffInMilliSeconds -= hours * 3600;
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  private buildPaxesReserve(booking: Booking, passengers: Array<CheckoutPassenger>) {
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

  private buildPaxesReserveV2(passengers: Array<CheckoutPassenger>) {
    return passengers.map((passenger) => {
      return {
        abbreviation: passenger.title,
        name: passenger.name,
        code: passenger.extCode,
        ages: passenger.age,
        lastname: passenger.lastname,
        phone: '',
        email: '',
        documentType: passenger.document.documentType,
        documentNumber: passenger.document.documentNumber,
        birthdate: this.formatBirthdate(passenger.dob),
        documentExpirationDate: '',
        nationality: passenger.document.nationality,
        phoneNumberCode: 34,
        type: passenger.type,
      };
    });
  }

  private formatBirthdate(dob: string) {
    let splitedDate = dob.split('-');
    splitedDate = splitedDate.reverse();
    return splitedDate.join('/');
  }

  private getPrebookingDataCache(hash: string): Promise<PrebookingDTO> {
    return this.managementHttpService.get(`${this.appConfigService.TECNOTURIS_URL}/packages-newblue/api/v1/pre-bookings/${hash}/`);
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
