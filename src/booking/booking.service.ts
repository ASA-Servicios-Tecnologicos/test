import { HttpService, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingDTO, DistributionDTO } from "../shared/dto/booking.dto";
import { Booking, BookingDocument } from "../shared/model/booking.schema";
import { CheckoutService } from "../checkout/services/checkout.service";
import { v4 as uuidv4 } from "uuid";
import { ManagementService } from "src/management/services/management.service";
import { AppConfigService } from "src/configuration/configuration.service";
import { lastValueFrom, map } from "rxjs";
import fetch from "node-fetch";
@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private checkoutService: CheckoutService,
    private managementService: ManagementService,
    private http: HttpService,
    private appConfigService: AppConfigService
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
    )["data"];
    console.log(checkout);

    // TODO: bookingId tiene que ser el generado por nosotros, cambiar checkoutId por el de la response
    const prebooking: Booking = {
      ...booking,
      bookingId: checkout.booking.bookingId,
      checkoutId: "CHK-FL-00432423", //checkout.checkoutId,
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
    console.log(checkout);
    const booking = await this.bookingModel
      .findOne({ checkoutId: checkout.checkoutId })
      .exec();
    console.log(booking);
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    const token = await this.managementService.auth();
    //TODO: Login contra management, recoger token, llamar a new blue
    const distributionPassengers =
      this.buildPassengersDistributionReserve(booking);
    const paxes = this.buildPaxesReserve(booking, checkout.passengers);

    //TODO: Con la info del checkout, llamar con el email etc a client/me para conseguir los datos del agency,id etc
    const body = {
      requestToken: booking.requestToken,
      providerToken: booking.providerToken,
      paxes: paxes,
      packageClient: {
        id: 822,
        address: null,
        agency: 633,
        agencyChain: 288,
        birthdate: null,
        city: null,
        createdAt: "2022-01-25T14:32:58.319397",
        document: 16891861,
        email: "a@b.com",
        name: "Prueba",
        nationality: "ES",
        phoneNumber: "666555444",
        surname: "Prueba",
        updatedAt: "2022-01-25T14:32:58.328821",
        bookingData: {
          totalAmount: booking.amount,
          hotels: booking.hotels,
          flights: booking.flights,
          transfers: booking.transfers,
          productTokenNewblue: booking.prebookingToken,
          distributionRooms: distributionPassengers,
          passengers: distributionPassengers,
          paxes: paxes,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          cancellationPolicyList: booking.cancellationPolicies,
          currency: booking.currency,
          requestToken: booking.requestToken,
          providerToken: booking.providerToken,
          distribution: this.buildDistribution(booking),
          commission: {
            pvp: booking.amount,
          },
          partialTotal: booking.amount,
          detailedPricing: {
            commissionableRate: booking.amount,
            nonCommissionableRate: 0,
          },
        },
      },
    };
    console.log(JSON.stringify(body));

    return fetch(
      `${this.appConfigService.TECNOTURIS_URL}/packages-providers/api/v1/bookings`,
      {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch((error) => console.log(error));
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
          phone: "",
          email: "",
          documentType: "PAS",
          documentNumber: "",
          birthdate: this.formatBirthdate(passenger.dob),
          documentExpirationDate: "",
          nationality: "",
          phoneNumberCode: 34,
          type: "",
        };
        paxes.push(pax);
      }
    });
    return paxes;
  }

  private formatBirthdate(dob: string) {
    let splitedDate = dob.split("-");
    splitedDate = splitedDate.reverse();
    return splitedDate.join("/");
  }

  private buildPassengersDistributionReserve(booking: Booking) {
    const groupByRoom = this.groupBy(booking.distribution, "room");
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
    const groupByRoom = this.groupBy(booking.distribution, "room");
    return groupByRoom.map((distribution) => {
      return {
        rooms: 1,
        adults: distribution.filter((passenger) => passenger.type === "ADULT")
          .length,
        children: distribution
          .filter((passenger) => passenger.type === "CHILD")
          .map((child) => child.age),
      };
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
