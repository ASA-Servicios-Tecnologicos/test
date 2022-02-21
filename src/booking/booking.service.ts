import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO, CreateManagementBookDto, ManagementBookDTO } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';
import { CheckoutService } from '../checkout/services/checkout.service';
import { v4 as uuidv4 } from 'uuid';
import { AppConfigService } from 'src/configuration/configuration.service';
import { CheckoutDTO, CheckoutPassenger, CreateCheckoutDTO } from 'src/shared/dto/checkout.dto';
import { ManagementHttpService } from 'src/management/services/management-http.service';
import { PrebookingDTO } from 'src/shared/dto/pre-booking.dto';
import { ClientService } from 'src/management/services/client.service';
import { ExternalClientService } from 'src/management/services/external-client.service';
import { GetManagementClientInfoByUsernameDTO } from 'src/shared/dto/management-client.dto';
import { PaymentsService } from 'src/payments/payments.service';
import { CreateUpdateDossierPaymentDTO } from 'src/shared/dto/dossier-payment.dto';
import { DossiersService } from 'src/dossiers/dossiers.service';
import { DiscountCodeService } from 'src/management/services/dicount-code.service';
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
    private paymentsService: PaymentsService,
    private dossiersService: DossiersService,
    private discountCodeService: DiscountCodeService,
  ) {}

  async create(booking: BookingDTO) {
    // TODO: Comprobar discountCode, llamar a endpoint
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (prebookingData?.status !== 200) {
      throw new HttpException(prebookingData.data, prebookingData.status);
    }
    let netAmount = this.applyRules(prebookingData, booking);
    if (booking.discount) {
      netAmount = await this.discountCodeService.validate(booking.discount, netAmount);
    }
    if (!this.verifyBooking(prebookingData, booking) || netAmount !== booking.amount) {
      throw new HttpException('La información del booking no coincide con el prebooking', 400);
    }

    booking.bookingId = uuidv4();
    const body: CreateCheckoutDTO = {
      booking: {
        bookingId: booking.bookingId,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
        amount: {
          value: netAmount,
          currency: booking.currency,
        },
        description: booking.hotelName,
        language: booking.language,
        market: booking.market,
        koURL: `${booking.koUrl}?bookingId=${booking.bookingId}`,
        okURL: `${booking.okUrl}?bookingId=${booking.bookingId}`,
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
    return { checkoutUrl: checkout.checkoutURL };
  }

  findById(id: string) {
    return this.bookingModel.findOne({ bookingId: id }).exec();
  }

  async doBooking(id: string) {
    const booking = await this.bookingModel.findOne({ bookingId: id }).exec();
    const checkout = await this.checkoutService.getCheckout(booking.checkoutId);
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (prebookingData?.status !== 200) {
      throw new HttpException(prebookingData.data, prebookingData.status);
    }

    this.saveBooking(prebookingData, booking, checkout);
    return {
      payment: checkout.payment,
      buyer: checkout.buyer,
      flights: prebookingData.data.flights,
      hotels: prebookingData.data.hotels,
      checkIn: prebookingData.data.checkIn,
      checkOut: prebookingData.data.checkOut,
      contact: checkout.contact,
      distribution: prebookingData.data.distribution,
      packageName: booking.packageName,
      date: new Date(),
    };
  }

  private saveBooking(prebookingData: PrebookingDTO, booking: Booking, checkout: CheckoutDTO) {
    const body = {
      requestToken: prebookingData.data.requestToken,
      providerToken: prebookingData.data.providerToken,
      paxes: this.buildPaxesReserveV2(checkout.passengers),
      packageClient: {
        bookingData: {
          hashPrebooking: booking.hashPrebooking,
          totalAmount: booking.amount,
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
          productName: prebookingData.data.productName,
        },
      },
    };
    this.managementHttpService
      .post(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/bookings/`, body)
      .then((res) => {
        console.log(JSON.stringify(res));

        this.createBookingInManagement(prebookingData, booking, checkout, res['data']['bookId'], res['data']['status']);
      })
      .catch((error) => this.createBookingInManagement(prebookingData, booking, checkout, null, 'ERROR'));
  }

  private async createBookingInManagement(
    prebookingData: PrebookingDTO,
    booking: Booking,
    checkOut: CheckoutDTO,
    bookId: string,
    status: string,
  ) {
    const client = await this.getOrCreateClient(checkOut);

    const createBookDTO: CreateManagementBookDto = {
      packageData: [
        {
          bookId: bookId,
          status: status,
          ...prebookingData.data,
          totalAmount: booking.amount,
          uuid: uuidv4(),
          agencyInfo: {
            agentNum: '',
            expediente: '',
          },
          commission: { pvp: booking.amount },
          integrationType: 'PACKAGE',
          adults: prebookingData.data.distribution.map((distribution) => distribution.adults).reduce((acc, current) => acc + current, 0),
          children: prebookingData.data.distribution
            .map((distribution) => distribution.children.length)
            .reduce((acc, current) => acc + current, 0),
          infants: 0,
          partialTotal: booking.amount,
          passengers: [...[...prebookingData.data.passengers.map((passenger) => passenger.passengers)]],
          providerName: booking.providerName,
          validateMessage: '',
          checkForm: true,
          isSelected: true,
          canBeBooked: true,
          comments: {
            agentComment: '',
            updatedPrice: booking.amount,
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
          paxes: this.buildPaxesReserveV2(checkOut.passengers),
        },
      ],
      dossier: null,
      client: client,
    };

    const bookingManagement = await this.managementHttpService.post<Array<ManagementBookDTO>>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking/`,
      createBookDTO,
    );

    const dossierPayments: CreateUpdateDossierPaymentDTO = {
      dossier: bookingManagement[0].dossier,
      bookingId: booking.bookingId,
      amount: {
        value: booking.amount,
        currency: booking.currency,
      },
      checkoutId: checkOut.checkoutId,
      installment: checkOut.payment.installments,
    };
    if (!bookId) {
      this.dossiersService.patchDossierById(bookingManagement[0].dossier, {
        dossier_situation: 7,
        observation: 'Ha ocurrido un error en la reserva del paquete',
      });
    }

    const update = await this.bookingModel.findOneAndUpdate({ bookingId: booking.bookingId }, { dossier: bookingManagement[0].dossier });
    (await update).save();
    this.paymentsService.createDossierPayments(dossierPayments);
    //TODO: Rendereizar un email con el dossier y enviarlo.
  }

  private async getOrCreateClient(checkOut: CheckoutDTO) {
    const client: GetManagementClientInfoByUsernameDTO = await this.clientService
      .getClientInfoByUsername(checkOut.contact.email)
      .catch((error) => {
        if (error.status === HttpStatus.BAD_REQUEST) {
          return this.clientService
            .getClientInfoByUsername(`${checkOut.contact.phone.prefix}${checkOut.contact.phone.phone}`)
            .catch((error) => {
              if (error.status === HttpStatus.BAD_REQUEST) {
                return null;
              }
              throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
            });
        } else {
          throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
        }
      });

    if (!client) {
      const integrationClient = await this.clientService.getIntegrationClient();
      const createdClient = await this.externalClientService.createExternalClient({
        accept_privacy_policy: true,
        agency: integrationClient.agency.id,
        agency_chain: integrationClient.agency.agency_chain_id,
        dni: checkOut.buyer.document.documentNumber,
        email: checkOut.contact.email,
        first_name: checkOut.buyer.name,
        last_name: checkOut.buyer.lastname,
        password1: '',
        password2: '',
        phone: `${checkOut.contact.phone.prefix}${checkOut.contact.phone.phone}`,
        role: 8,
        username: checkOut.contact.email,
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

  private buildPaxesReserveV2(passengers: Array<CheckoutPassenger>) {
    return passengers.map((passenger) => {
      return {
        abbreviation: passenger.title,
        name: passenger.name,
        code: parseInt(passenger.extCode),
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
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/packages-newblue/api/v1/pre-bookings/${hash}/`);
  }

  async getRemoteCheckout(id: string) {
    return await this.checkoutService.getCheckout(id);
  }

  private verifyBooking(prebooking: PrebookingDTO, booking: BookingDTO | BookingDocument) {
    if (prebooking.data.hashPrebooking === booking.hashPrebooking) {
      return true;
    }
    return false;
  }

  private applyRules(prebooking: PrebookingDTO, booking: BookingDTO | BookingDocument) {
    if (!prebooking.data.rules) {
      return prebooking.data.totalAmount;
    } else {
      const today = new Date();
      const startDate = this.formatRulesDates(prebooking.data.rules.startDate);
      const endDate = this.formatRulesDates(prebooking.data.rules.endDate);
      if (today >= startDate && today <= endDate) {
        if (prebooking.data.rules.type === 'AMOUNT') {
          return prebooking.data.totalAmount - prebooking.data.rules.amount;
        } else {
          return prebooking.data.totalAmount - (prebooking.data.totalAmount * prebooking.data.rules.amount) / 100;
        }
      } else {
        throw new HttpException('Las fechas de las rules son erroneas', HttpStatus.BAD_REQUEST);
      }
    }
  }

  private formatRulesDates(date: string): Date {
    const [dd, mm, yyyy] = date.split('-');
    return new Date(`${mm}/${dd}/${yyyy}`);
  }
}
