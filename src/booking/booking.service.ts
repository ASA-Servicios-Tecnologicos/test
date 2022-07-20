import { DossierPaymentInstallment } from './../shared/dto/dossier-payment.dto';
import { HeadersDTO } from './../shared/dto/header.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO, BookPackageProviderDTO, CreateManagementBookDto, ManagementBookDTO } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';
import { CheckoutService } from '../checkout/services/checkout.service';
import { v4 as uuidv4 } from 'uuid';
import t from 'typy';
import { logger } from '../logger';
import { ManagementHttpService } from '../management/services/management-http.service';
import { AppConfigService } from '../configuration/configuration.service';
import { ClientService } from '../management/services/client.service';
import { ExternalClientService } from '../management/services/external-client.service';
import { PaymentsService } from '../payments/payments.service';
import { DossiersService } from '../dossiers/dossiers.service';
import { DiscountCodeService } from '../management/services/dicount-code.service';
import { NotificationService } from '../notifications/services/notification.service';
import { BookingDocumentsService } from '../booking-documents/services/booking-documents.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { CreateCheckoutDTO } from '../shared/dto/checkout.dto';
import { PrebookingDTO } from '../shared/dto/pre-booking.dto';
import { DossierDto } from '../shared/dto/dossier.dto';
import { CheckoutDTO, CheckoutContact, CheckoutBuyer, CheckoutPassenger } from '../shared/dto/checkout.dto';
import { CreateUpdateDossierPaymentDTO } from '../shared/dto/dossier-payment.dto';
import { OtaClientDTO } from '../shared/dto/ota-client.dto';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';
import { ContentAPI } from '../shared/dto/content-api.dto';
import { getCodeMethodType } from '../utils/utils';

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
    private bookingDocumentsService: BookingDocumentsService,
    private readonly bookingServicesService: BookingServicesService,
  ) {}

  async create(booking: BookingDTO) {
    logger.info(`[BookingService] [create] init method`);
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (prebookingData?.status !== 200) {
      logger.error(`[BookingService] [create] the prebookingData from the cache has no status ok`);
      throw new HttpException(prebookingData.data, prebookingData.status);
    }
    let netAmount = this.applyRules(prebookingData, booking);
    if (booking.discount) {
      netAmount = await this.discountCodeService.validate(booking.discount, netAmount);
      if (netAmount['status']) {
        logger.warn(`[BookingService] [create] --netAmount ${netAmount}`);
        throw new HttpException({ message: netAmount['message'], error: netAmount['error'] }, netAmount['status']);
      }
    }
    if (!this.verifyBooking(prebookingData, booking) || netAmount !== booking.amount) {
      logger.error(`[BookingService] [create] booking and prebooking does not match --netAmount ${netAmount} --amount ${booking.amount}`);
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
        backURL: booking.backURL,
        distribution: booking.distribution,
        cancellationPolicies: booking.cancellationPolicies,
      },
    };

    const checkout = (await this.checkoutService.doCheckout(body))['data'];
    const prebooking: Booking = {
      ...booking,
      dicountCode: booking.discount ? booking.discount.couponCode : '',
      bookingId: booking.bookingId,
      checkoutId: checkout.checkoutId,
      hotelCode: t(prebookingData, 'data.hotels[0].hotelId').safeString,
      discount: {
        rate: booking.discount?.rate,
        amount: booking.discount?.amount,
        amountCurrency: booking.discount?.amountCurrency,
      },
    };
    const createdBooking = new this.bookingModel(prebooking);
    await createdBooking.save();
    return { checkoutUrl: checkout.checkoutURL };
  }

  findById(id: string) {
    return this.bookingModel.findOne({ bookingId: id }).exec();
  }

  findByDossier(dossier: string) {
    return this.bookingModel.findOne({ dossier: parseInt(dossier) }).exec();
  }

  async doBooking(id: string, headers?: HeadersDTO) {
    logger.info(`[BookingService] [doBooking] init method`);
    const booking = await this.bookingModel.findOne({ bookingId: id }).exec();
    if (!booking) {
      logger.error(`[BookingService] [doBooking] booking not found`);
      throw new HttpException('Booking no encontrado', HttpStatus.NOT_FOUND);
    }
    const checkout = await this.checkoutService.getCheckout(booking.checkoutId);
    if (checkout['error']) {
      throw new HttpException(checkout['error']['message'], checkout['error']['status']);
    }
    const prebookingData = await this.getPrebookingDataCache(booking.hashPrebooking);
    if (prebookingData?.status !== 200) {
      logger.error(`[BookingService] [doBooking] the prebookingData has no status ok`);
      throw new HttpException(prebookingData.data, prebookingData.status);
    }

    checkout.payment.installments.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA > dateB ? 1 : -1;
    });

    return this.saveBooking(prebookingData, booking, checkout, headers);
  }

  private async saveBooking(prebookingData: PrebookingDTO, booking: Booking, checkout: CheckoutDTO, headers?: HeadersDTO) {
    logger.info(`[BookingService] [saveBooking] init method`);
    const bookingManagement = await this.createBookingInManagement(prebookingData, booking, checkout);

    let dossier: DossierDto;

    if (bookingManagement && bookingManagement.length) {
      dossier = await this.dossiersService.findDossierById(bookingManagement[0]?.dossier);
    }

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
      agencyInfo: { clientReference: dossier?.code, agent: 'flowo.com' },
    };

    return this.managementHttpService
      .post<BookPackageProviderDTO>(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/bookings/`, body, {
        timeout: 120000,
        headers,
      })
      .then((res) => {
        logger.info(`[BookingService] [saveBooking] POST booking --bookId ${res.data.bookId}`);
        return this.processBooking(dossier, bookingManagement, prebookingData, booking, checkout, res.data.bookId, res.data.status);
      })
      .catch((error) => {
        logger.warn(`[BookingService] [saveBooking] POST booking ${error.stack}`);
        return this.processBooking(dossier, bookingManagement, prebookingData, booking, checkout, null, 'ERROR');
      });
  }

  private async createBookingInManagement(prebookingData: PrebookingDTO, booking: Booking, checkOut: CheckoutDTO) {
    logger.info(`[BookingService] [createBookingInManagement] init method`);
    const client = await this.getOrCreateClient(checkOut).catch((error) => {
      logger.error(`[BookingService] [createBookingInManagement] getOrCreateClient`);
      return error;
    });

    if (isNaN(client)) {
      logger.error(`[BookingService] [createBookingInManagement] client not found`);
      throw new HttpException(client, HttpStatus.NOT_FOUND);
    }

    const createBookDTO: CreateManagementBookDto = {
      packageData: [
        {
          ...prebookingData.data,
          bookId: '',
          status: '',
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
          paxes: this.buildPaxesReserveV2(checkOut.passengers, false),
          checkoutId: checkOut.checkoutId,
          discount: {
            rate: booking.discount?.rate,
            amount: booking.discount?.amount,
            amountCurrency: booking.discount?.amountCurrency,
          },
        },
      ],
      dossier: null,
      client: client,
    };

    const bookingManagement = await this.managementHttpService
      .post<Array<ManagementBookDTO>>(`${this.appConfigService.BASE_URL}/management/api/v1/booking/`, createBookDTO)
      .catch((error) => {
        logger.error(`[BookingService] [createBookingInManagement] POST booking ${error.stack}`);
        return null;
      });

    return bookingManagement;
  }

  private async processBooking(
    dossier: DossierDto,
    bookingManagement: any,
    prebookingData: PrebookingDTO,
    booking: Booking,
    checkOut: CheckoutDTO,
    bookId: string,
    status: string,
  ) {
    logger.info(`[BookingService] [processBooking] init method`);
    if (bookingManagement) {
      const dossierPayments: CreateUpdateDossierPaymentDTO = {
        dossier: bookingManagement[0].dossier,
        bookingId: booking.bookingId,
        paymentMethods: getCodeMethodType(checkOut.payment.methodType),
        amount: {
          value: booking.amount,
          currency: booking.currency,
        },
        checkoutId: checkOut.checkoutId,
        installment: this.validateAndConvertPayments(checkOut.payment.methodType, checkOut.payment.installments),
      };

      if (bookId) {
        const serviceData: any = {
          locator: bookId,
        };

        if (dossier && dossier.services && dossier.services.length) {
          const rawData = dossier.services[0].raw_data;
          rawData.status = status;
          rawData.bookId = bookId;
          serviceData['raw_data'] = rawData;
        }

        this.dossiersService.patchBookingServiceById(bookingManagement[0].id, serviceData).catch(() => {});
      } else {
        this.dossiersService.patchDossierById(bookingManagement[0].dossier, {
          dossier_situation: 7,
          observation: 'Ha ocurrido un error en la reserva del paquete',
        });
      }
      const update = await this.bookingModel
        .findOneAndUpdate({ bookingId: booking.bookingId }, { dossier: bookingManagement[0].dossier, locator: bookId })
        .exec();
      update.save();
      this.paymentsService.createDossierPayments(dossierPayments);
    } else {
      const update = await this.bookingModel.findOneAndUpdate({ bookingId: booking.bookingId }, { locator: bookId }).exec();
      update.save();
    }
    const dataContentApi: any = await this.bookingServicesService.getInformationContentApi(booking.hotelCode).catch((error) => {
      logger.error(`[BookingService] [processBooking] ${error.stack}`);
    });
    const methodsDetails = t(checkOut, 'payment.methodDetail').safeObject;

    if (bookingManagement) {
      if (dossier?.code) {
        this.sendConfirmationEmail(prebookingData, booking, checkOut, bookId, status, dossier.code, dataContentApi);
        // const pendingPayments = checkOut.payment.installments.filter((installment) => installment.status !== 'COMPLETED');
        // if (!pendingPayments.length) {
        //   this.sendBonoEmail(dossier?.code, bookId, checkOut.contact, checkOut.buyer);
        // }
      } else {
        this.sendConfirmationEmail(prebookingData, booking, checkOut, bookId, status, 'Nº expediente', dataContentApi);
      }
    } else {
      this.sendConfirmationEmail(prebookingData, booking, checkOut, bookId, status, 'Nº expediente', dataContentApi);
    }

    return {
      dossier: dossier?.code ? dossier.code : 'Nº expediente',
      payment: checkOut.payment,
      buyer: checkOut.buyer,
      flights: prebookingData.data.flights,
      hotels: prebookingData.data.hotels,
      checkIn: prebookingData.data.checkIn,
      checkOut: prebookingData.data.checkOut,
      contact: checkOut.contact,
      distribution: prebookingData.data.distribution,
      packageName: booking.packageName,
      programId: booking.programId,
      packageCountry: booking.packageCountry,
      packageCategory: booking.packageCategory,
      packageDestination: booking.packageDestination,
      dicountCode: booking.dicountCode,
      bookId,
      date: new Date(),
      methodsDetails: methodsDetails !== undefined ? methodsDetails : {},
    };
  }

  private sendBonoEmail(dossierCode: string, locator: string, contact: CheckoutContact, buyer: CheckoutBuyer) {
    this.bookingDocumentsService.sendBonoEmail(dossierCode, 'NBLUE', locator, contact, buyer);
  }

  public async getClientOrCreate(client: OtaClientDTO): Promise<number> {
    logger.info(`[BookingService] [getClientOrCreate] init method`);
    const checkoutContact: CheckoutContact = {
      address: undefined,
      phone: {
        phone: +client.phone,
        prefix: client?.prefix ? client?.prefix : '',
      },
      email: client.mail,
      newsletter: false,
    };

    const checkoutBuyer: CheckoutBuyer = {
      gender: '',
      name: client.name,
      title: '',
      lastname: client.surname,
      dob: '',
      country: '',
      document: undefined,
    };

    const checkOut: CheckoutDTO = {
      checkoutURL: '',
      booking: {
        bookingId: '',
        okURL: '',
        koURL: '',
        backURL: '',
        amount: undefined,
        startDate: '',
        endDate: '',
      },
      checkoutId: '',
      passengers: [],
      payment: undefined,
      buyer: checkoutBuyer,
      contact: checkoutContact,
    };

    return this.getOrCreateClient(checkOut);
  }

  private async getOrCreateClient(checkOut: CheckoutDTO) {
    logger.info(`[BookingService] [getOrCreateClient] init method --checkout ${JSON.stringify(checkOut)}`);
    const client: GetManagementClientInfoByUsernameDTO = await this.clientService
      .getClientInfoByUsername(checkOut.contact.email)
      .catch((error) => {
        logger.error(`[BookingService] [getOrCreateClient] for email ${error.stack}`);
        if (error.status === HttpStatus.BAD_REQUEST) {
          return this.clientService
            .getClientInfoByUsername(`${checkOut.contact.phone.prefix}${checkOut.contact.phone.phone}`)
            .catch((e) => {
              logger.error(`[BookingService] [getOrCreateClient] for phone ${e.stack}`);
              if (e.status === HttpStatus.BAD_REQUEST) {
                return null;
              }
              throw new HttpException({ message: e.message, error: e.response.data || e.message }, e.response.status);
            });
        } else {
          throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
        }
      });

    if (!client) {
      logger.info(`[BookingService] [createExternalClient] create client`);
      const integrationClient = await this.clientService.getIntegrationClient();
      const createdClient = await this.externalClientService
        .createExternalClient({
          agency: integrationClient.agency.id,
          agency_chain: integrationClient.agency.agency_chain_id,
          dni: checkOut.buyer.document?.documentNumber,
          email: checkOut.contact.email,
          first_name: checkOut.buyer.name,
          last_name: checkOut.buyer.lastname,
          password1: '',
          password2: '',
          phone: `${checkOut.contact.phone.prefix}${checkOut.contact.phone.phone}`,
          role: 8,
          username: checkOut.contact.email,
          active: false,
          country_iso: checkOut?.buyer?.document.nationality,
          address: checkOut.contact.address.address,
          postal_code: checkOut.contact.address.postalCode,
          province: checkOut.contact.address.city,
          type_document_name: checkOut.buyer.document.documentType,
        })
        .catch((error) => {
          logger.error(`[BookingService] [createExternalClient] ${error.stack}`);
          throw error;
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

  private buildPaxesReserveV2(passengers: Array<CheckoutPassenger>, formatBirthdate = true) {
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
        birthdate: formatBirthdate ? this.formatBirthdate(passenger.dob) : passenger.dob,
        documentExpirationDate: passenger.document.expirationDate
          ? formatBirthdate
            ? this.formatBirthdate(passenger.document.expirationDate)
            : passenger.document.expirationDate
          : '',
        nationality: passenger.country,
        nationality_of_id: passenger.document.nationality,
        gender: passenger.gender.includes('MALE') ? 2 : 1,
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
    logger.info(`[BookingService] [applyRules] init method`);
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
          logger.error(`[BookingService] [applyRules] The dates of the rules are wrong`);
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
          logger.error(`[BookingService] [applyRules] The dates of the rules are wrong`);
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
          logger.error(`[BookingService] [applyRules] The dates of the rules are wrong`);
          throw new HttpException('Las fechas de las rules son erroneas', HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  private formatRulesDates(date: string): Date {
    const [dd, mm, yyyy] = date.split('-');
    return new Date(`${mm}/${dd}/${yyyy}`);
  }

  private sendConfirmationEmail(
    prebookingData: PrebookingDTO,
    booking: Booking,
    checkOut: CheckoutDTO,
    bookId: string,
    status: string,
    dossier: string,
    contentInfo: ContentAPI,
  ) {
    logger.info(`[BookingService] [sendConfirmationEmail] init method`);
    const methodsDetails = t(checkOut, 'payment.methodDetail').safeObject;

    let adults = 0;
    let kids = 0;

    checkOut.passengers.forEach((passenger: any) => {
      passenger.type.toUpperCase() === 'ADULT' ? (adults += 1) : (kids += 1);
    });

    const hotel = prebookingData.data.hotels[0];
    const starValue = +hotel.category.value;
    const stars: number[] = [];
    for (let i = 1; i <= starValue; i++) {
      stars.push(i);
    }

    const data = {
      methodType: checkOut.payment.methodType ?? 'CARD',
      buyerName: `${checkOut.buyer.name} ${checkOut.buyer.lastname}`,
      reference: bookId ?? 'Pendiente',
      dossier: dossier,
      pricePerPerson: checkOut.payment.amount.value / checkOut.passengers.length,
      personsNumber: checkOut.passengers.length,
      amount: checkOut.payment.amount.value,
      currency: checkOut.payment.amount.currency,
      payments: checkOut.payment.installments,
      packageName: booking.packageName,
      flights: [
        ...prebookingData.data.flights.map((flight) => {
          return [
            {
              departureAirportCode: flight.outward[0].departure.airportCode,
              arrivalAirportCode: flight.outward[0].arrival.airportCode,
              departureDate: flight.outward[0].departure.date,
              arrivalDate: flight.outward[0].arrival.date,
              passengers_adults: adults,
              passenger_kids: kids,
            },
            {
              departureAirportCode: flight.return[0].departure.airportCode,
              arrivalAirportCode: flight.return[0].arrival.airportCode,
              departureDate: flight.return[0].departure.date,
              arrivalDate: flight.return[0].arrival.date,
              passengers_adults: adults,
              passenger_kids: kids,
            },
          ];
        }),
      ][0],
      transfers: prebookingData.data.transfers.map((transfer) => {
        return {
          ...transfer,
          passengers_adults: adults,
          passenger_kids: kids,
        };
      }),
      passengers: checkOut.passengers,
      cancellationPollicies: prebookingData.data.cancellationPolicyList,
      insurances: prebookingData.data.insurances,
      observations: prebookingData.data.observations,
      hotelRemarks: prebookingData.data.hotels[0].remarks,
      hotel: hotel,
      room: hotel.rooms[0],
      methodsDetails: methodsDetails !== undefined ? methodsDetails : {},
      contentInfo: contentInfo !== undefined ? contentInfo : {},
      adults,
      kids,
      stars,
    };

    this.notificationsService.sendConfirmationEmail(data, checkOut.contact.email);
  }

  private validateAndConvertPayments(methodType: string, payments: Array<DossierPaymentInstallment>) {
    if (methodType === 'BANK_TRANSFER') {
      const paymentFilters = payments.map((payment) => {
        payment.status = 'PENDING';
        return payment;
      });
      logger.info(`[BookingService] [validateAndConvertPayments]  payments convert to PENDING`);
      return paymentFilters;
    } else {
      return payments;
    }
  }
}
