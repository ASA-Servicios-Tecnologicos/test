import { HttpService, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingDTO } from "../shared/dto/booking.dto";
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
          currency: booking.currency,
          language: booking.language,
          market: booking.market,
          totalAmount: booking.amount,
          koURL: booking.koUrl,
          okURL: booking.okUrl,
          distribution: booking.distribution,
          cancellationPolicies: booking.cancellationPolicies,
        },
      })
    )["data"];

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
    //process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    const token = await this.managementService.auth();
    console.log(token);
    //TODO: Login contra management, recoger token, llamar a new blue
    const body = {
      requestToken: booking.requestToken,
      providerToken: booking.providerToken,
      paxes: this.buildPaxesReserve(booking, checkout.passengers),
      packageClient: {
        bookingData: {
          productTokenNewblue: booking.prebookingToken,
          distributionRooms: [
            {
              code: 1,
              passengers: checkout.passengers.map((passenger, index) => {
                return {
                  holder: false,
                  code: index + 1,
                  age: this.getAge(passenger.dob),
                  gender: null,
                  name: null,
                  surname: null,
                  dateOfBith: null,
                  extraData: [],
                };
              }),
            },
          ],
        },
      },
    };
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
          code: distribution.extCode,
          ages: distribution.age,
          lastname: passenger.lastname,
          phone: "",
          email: "",
          documentType: "PAS",
          documentNumber: "",
          birthdate: passenger.dob,
          documentExpirationDate: "",
          nationality: "",
        };
        paxes.push(pax);
      }
    });
    return paxes;
  }

  private getAge(dob: string) {
    const now = new Date();
    const birthDate = new Date(dob);

    let years = now.getFullYear() - birthDate.getFullYear();

    if (
      now.getMonth() < birthDate.getMonth() ||
      (now.getMonth() == birthDate.getMonth() &&
        now.getDate() < birthDate.getDate())
    ) {
      years--;
    }

    return years;
  }

  async getRemoteCheckout(id: string) {
    return await this.checkoutService.getCheckout(id);
  }
}
