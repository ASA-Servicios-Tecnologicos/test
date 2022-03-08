import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO, BookPackageProviderDTO, CreateManagementBookDto, ManagementBookDTO } from '../shared/dto/booking.dto';
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
import { readFileSync } from 'fs';
import { NotificationService } from 'src/notifications/services/notification.service';
import { EmailDTO } from 'src/shared/dto/email.dto';

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
    private notificationsService: NotificationService,
  ) {}

  async create(booking: BookingDTO) {
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (prebookingData?.status !== 200) {
      throw new HttpException(prebookingData.data, prebookingData.status);
    }
    let netAmount = this.applyRules(prebookingData, booking);
    if (booking.discount) {
      netAmount = await this.discountCodeService.validate(booking.discount, netAmount);
      if (netAmount['status']) {
        throw new HttpException({ message: netAmount['message'], error: netAmount['error'] }, netAmount['status']);
      }
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
    checkout.payment.installments = checkout.payment.installments.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA > dateB ? 1 : -1;
    });

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
          detailedPricing: prebookingData.data.detailedPricing,
        },
      },
    };
    this.managementHttpService
      .post<BookPackageProviderDTO>(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/bookings/`, body, { timeout: 120000 })
      .then((res) => {
        this.createBookingInManagement(prebookingData, booking, checkout, res.data.bookId, res.data.status);
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
          ...prebookingData.data,
          bookId: bookId,
          status: status,
          totalAmount: booking.amount,
          newsletter: checkOut.contact.newsletter ?? false,
          uuid: uuidv4(),
          agencyInfo: {
            agentNum: '',
            expediente: '',
          },
          detailedPricing: {
            ...prebookingData.data.detailedPricing,
            commission:
              (prebookingData.data.detailedPricing.commissionAmount / prebookingData.data.detailedPricing.commissionableRate) * 100,
            discount: prebookingData.data.totalAmount - booking.amount,
            netAmount: prebookingData.data.detailedPricing.netAmount,
            totalAmount: booking.amount,
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
      paymentMethods:
        checkOut.payment.paymentMethods[0].code === '1'
          ? 4
          : checkOut.payment.paymentMethods[0].code === '2'
          ? 2
          : parseInt(checkOut.payment.paymentMethods[0].code),
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

    const update = await this.bookingModel.findOneAndUpdate(
      { bookingId: booking.bookingId },
      { dossier: bookingManagement[0].dossier, locator: bookId },
    );
    (await update).save();
    this.paymentsService.createDossierPayments(dossierPayments);
    this.sendConfirmationEmail(prebookingData, booking, checkOut, bookId, status);
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
      const createdClient = await this.externalClientService
        .createExternalClient({
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
          active: false,
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
      return createdClient?.client;
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
      if (prebooking.data.rules.startDate && prebooking.data.rules.endDate) {
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
      } else if (!prebooking.data.rules.startDate && !prebooking.data.rules.endDate) {
        if (prebooking.data.rules.type === 'AMOUNT') {
          return prebooking.data.totalAmount - prebooking.data.rules.amount;
        } else {
          return prebooking.data.totalAmount - (prebooking.data.totalAmount * prebooking.data.rules.amount) / 100;
        }
      } else if (prebooking.data.rules.startDate && !prebooking.data.rules.endDate) {
        const startDate = this.formatRulesDates(prebooking.data.rules.startDate);
        if (today >= startDate) {
          if (prebooking.data.rules.type === 'AMOUNT') {
            return prebooking.data.totalAmount - prebooking.data.rules.amount;
          } else {
            return prebooking.data.totalAmount - (prebooking.data.totalAmount * prebooking.data.rules.amount) / 100;
          }
        } else {
          throw new HttpException('Las fechas de las rules son erroneas', HttpStatus.BAD_REQUEST);
        }
      } else if (!prebooking.data.rules.startDate && prebooking.data.rules.endDate) {
        const endDate = this.formatRulesDates(prebooking.data.rules.endDate);
        if (today <= endDate) {
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
  }

  private formatRulesDates(date: string): Date {
    const [dd, mm, yyyy] = date.split('-');
    return new Date(`${mm}/${dd}/${yyyy}`);
  }

  private sendConfirmationEmail(prebookingData: PrebookingDTO, booking: Booking, checkOut: CheckoutDTO, bookId: string, status: string) {
    const data = {
      buyerName: `${checkOut.buyer.name} ${checkOut.buyer.lastname}`,
      reference: bookId ?? 'Pendiente',
      pricePerPerson: checkOut.payment.amount.value / checkOut.passengers.length,
      personsNumber: checkOut.passengers.length,
      amount: checkOut.payment.amount.value,
      currency: checkOut.payment.amount.currency,
      payments: checkOut.payment.installments,
      packageName: booking.packageName,
      flights: prebookingData.data.flights,
      transfers: prebookingData.data.transfers,
      passengers: checkOut.passengers,
      cancellationPollicies: prebookingData.data.cancellationPolicyList,
      insurances: prebookingData.data.insurances,
      observations: prebookingData.data.observations,
      hotelRemarks: prebookingData.data.hotels[0].remarks,
    };
    this.notificationsService.sendConfirmationEmail(data, checkOut.contact.email);
  }

  private testTemplate() {
    let data = {
      buyerName: 'Dani Nieto',
      reference: '1522189',
      pricePerPerson: 756.65,
      personsNumber: 2,
      amount: 1513.3,
      currency: 'EUR',
      payments: [
        {
          dueDate: '2022-09-13',
          amount: { value: 227, currency: 'EUR' },
          recurrent: true,
          status: 'PENDING',
          orderCode: '7ecebb4d-01ca-4737-b5fc-97bc12de73de-1',
        },
        {
          dueDate: '2022-09-18',
          amount: { value: 378.33, currency: 'EUR' },
          recurrent: true,
          status: 'PENDING',
          orderCode: '7ecebb4d-01ca-4737-b5fc-97bc12de73de-2',
        },
        {
          dueDate: '2022-09-21',
          amount: { value: 756.64, currency: 'EUR' },
          recurrent: true,
          status: 'PENDING',
          orderCode: '7ecebb4d-01ca-4737-b5fc-97bc12de73de-3',
        },
        {
          dueDate: '2022-02-22',
          amount: { value: 151.33, currency: 'EUR' },
          recurrent: false,
          status: 'COMPLETED',
          orderCode: '7ecebb4d-01ca-4737-b5fc-97bc12de73de-0',
        },
      ],
      packageName: 'Playa Mujeres y Costa Mujeres - Absolut',
      flights: [
        {
          totalPrice: 0,
          outward: [
            {
              departure: {
                date: '2022-10-01T15:30:00',
                airportCode: 'MAD',
                offset: { gmt: 1, dst: 2 },
                airportDescription: null,
                country: null,
              },
              arrival: {
                date: '2022-10-01T17:55:00',
                airportCode: 'PUJ',
                offset: { gmt: -4, dst: -4 },
                airportDescription: null,
                country: null,
              },
              segmentList: [{ origin: 'MAD', destination: 'PUJ', dateAt: '2022-10-01T17:55:00' }],
              company: {
                companyId: 'WFL',
                companyName: 'WFL',
                operationCompanyCode: 'WFL',
                operationCompanyName: null,
                transportNumber: '3503',
              },
              flightClass: { classId: null, className: 'A', classStatus: null },
            },
          ],
          return: [
            {
              departure: {
                date: '2022-10-08T19:55:00',
                airportCode: 'PUJ',
                offset: { gmt: -4, dst: -4 },
                airportDescription: null,
                country: null,
              },
              arrival: {
                date: '2022-10-09T10:05:00',
                airportCode: 'MAD',
                offset: { gmt: 1, dst: 2 },
                airportDescription: null,
                country: null,
              },
              segmentList: [{ origin: 'PUJ', destination: 'MAD', dateAt: '2022-10-09T10:05:00' }],
              company: {
                companyId: 'WFL',
                companyName: 'WFL',
                operationCompanyCode: 'WFL',
                operationCompanyName: null,
                transportNumber: '3504',
              },
              flightClass: { classId: null, className: 'A', classStatus: null },
            },
          ],
          id: 0,
          packageBookId: '',
          flightBookId: '',
          selected: true,
        },
      ],
      passengers: [
        {
          passengerId: 415,
          gender: 'MALE',
          title: '',
          name: 'Dani',
          lastname: 'Nieto',
          dob: '1997-10-07',
          document: { documentType: 'DNI', documentNumber: '97755993J', expeditionDate: '2022-02-09', nationality: 'ES' },
          country: 'ES',
          room: '1',
          age: 30,
          extCode: '1',
          type: 'ADULT',
        },
        {
          passengerId: 416,
          gender: 'MALE',
          title: '',
          name: 'Sergio',
          lastname: 'Pedrero',
          dob: '1996-10-08',
          document: { documentType: 'DNI', documentNumber: '78712649W', expeditionDate: '2022-02-02', nationality: 'ES' },
          country: 'ES',
          room: '1',
          age: 30,
          extCode: '2',
          type: 'ADULT',
        },
      ],
      cancellationPollicies: [
        {
          amount: 0,
          fromDate: '2022-02-22',
          toDate: '2022-09-23',
          currency: 'EUR',
          type: null,
          text: 'En el caso de indicarse gastos en las Observaciones del alojamiento de esta reserva, ese importe será sumando al importe indicado en estas condiciones hasta 7 días antes de la salida.',
        },
        {
          amount: 0,
          fromDate: '2022-02-22',
          toDate: '2022-10-01',
          currency: null,
          type: 'ABSOLUTE',
          text: 'Sin gastos de gestión. Del 2022-02-22 hasta 2022-10-01 con un valor de 0 €',
        },
        {
          amount: 10,
          fromDate: '2022-09-01',
          toDate: '2022-09-15',
          currency: null,
          type: 'PERCENTAGE',
          text: '10% gastos de penalización 30 días antes la salida. Del 2022-09-01 hasta 2022-09-15 con un valor de 10 %',
        },
        {
          amount: 25,
          fromDate: '2022-09-16',
          toDate: '2022-09-20',
          currency: null,
          type: 'PERCENTAGE',
          text: '25% gastos de penalización 15 días antes la salida. Del 2022-09-16 hasta 2022-09-20 con un valor de 25 %',
        },
        {
          amount: 50,
          fromDate: '2022-09-21',
          toDate: '2022-09-23',
          currency: null,
          type: 'PERCENTAGE',
          text: '50% gastos de penalización 10 días antes la salida. Del 2022-09-21 hasta 2022-09-23 con un valor de 50 %',
        },
        {
          amount: 100,
          fromDate: '2022-09-24',
          toDate: '2022-10-01',
          currency: null,
          type: 'PERCENTAGE',
          text: '100% gastos de penalización 7 días antes la salida. Del 2022-09-24 hasta 2022-10-01 con un valor de 100 %',
        },
      ],
      transfers: [
        {
          packageBookId: null,
          transferBookId: 'WROAbr5084k7JArl-8hT8IuO2Uv3qWDmJbznZtzdI9A=',
          productCode: 'WROAbr5084k7JArl-8hT8IuO2Uv3qWDmJbznZtzdI9A=',
          dateAt: '2022-10-01',
          description: 'Traslado Aeropuerto - Hotel en Punta Cana (Aeropuerto / Whala!Bavaro)',
          origin: 'Traslado Aeropuerto - Hotel en Punta Cana (Aeropuerto / Whala!Bavaro)',
          destination: null,
          price: {
            passengerRequirement: '',
            optionToken: null,
            status: 'CONFIRMED',
            isCancellable: false,
            subcategoryList: '',
            servicePrice: {
              total: {
                amount: 0,
                currency: 'EUR',
              },
            },
          },
          images: [],
          selected: true,
        },
        {
          packageBookId: null,
          transferBookId: 'QVyH4STxbht8gupwXdIflGIWwHFpI3FABMYKvrYGHFQ=',
          productCode: 'QVyH4STxbht8gupwXdIflGIWwHFpI3FABMYKvrYGHFQ=',
          dateAt: '2022-10-01',
          description: 'Asistencia en destino R. Dominicana (Whala!bavaro /  Whala!Bavaro)',
          origin: 'Asistencia en destino R. Dominicana (Whala!bavaro /  Whala!Bavaro)',
          destination: null,
          price: {
            passengerRequirement: '',
            optionToken: null,
            status: 'CONFIRMED',
            isCancellable: false,
            subcategoryList: '',
            servicePrice: {
              total: {
                amount: 0,
                currency: 'EUR',
              },
            },
          },
          images: [],
          selected: false,
        },
      ],
    };
    const formatDatesCancellationPollicies = function (text: string) {
      const findings = text.match(/(\d{1,4}([.\--])\d{1,2}([.\--])\d{1,4})/g);
      if (findings) {
        findings.forEach((finding) => {
          let splitedDate = finding.split('-');
          splitedDate = splitedDate.reverse();
          text = text.replace(finding, splitedDate.join('/'));
        });
      }
      return text;
    };
    data.cancellationPollicies = data.cancellationPollicies.map((policy) => {
      return {
        ...policy,
        title: policy.text.split('.')[0].replace('gestión', 'cancelación'),
        text: formatDatesCancellationPollicies(policy.text.split('.')[1]).replace('gestión', 'cancelación'),
      };
    });
    const lowestDatePolicy = data.cancellationPollicies
      .filter((policy) => policy.amount !== 0)
      .find(
        (policy) =>
          Math.min(...data.cancellationPollicies.map((policy) => new Date(policy.fromDate).getMilliseconds())) ===
          new Date(policy.fromDate).getMilliseconds(),
      );
    const noExpensesPolicy = data.cancellationPollicies.findIndex((policy) => policy['title'].includes('cancelación'));
    const datesInText = data.cancellationPollicies[noExpensesPolicy].text.match(/(\d{1,4}([.\/-])\d{1,2}([.\/-])\d{1,4})/g);
    const date = new Date(lowestDatePolicy.fromDate);
    date.setDate(date.getDate() - 1);
    if (datesInText) {
      data.cancellationPollicies[noExpensesPolicy].text = data.cancellationPollicies[noExpensesPolicy].text.replace(
        datesInText[1],
        new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date),
      );
    }

    let flowo_email_confirmation = readFileSync('src/notifications/templates/flowo_email_confirmation.hbs', 'utf8');
    let template = Handlebars.compile(flowo_email_confirmation);
    let emailTemplate = template(data);
    /* const email: EmailTemplatedDTO = {
      uuid: uuidv4(),
      applicationName: 'application-code',
      from: 'noreply@myfrom.com',
      to: [chec],
      subject: 'Email test',
      locale: 'es_ES',
      literalProject: 'examples',
      templateCode: 'test-html',
    };
    this.notificationsService.sendMailTemplated(email); */
    console.log(emailTemplate);
  }
}
