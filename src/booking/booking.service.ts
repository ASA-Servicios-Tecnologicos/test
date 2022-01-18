import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';
import { CheckoutService } from '../checkout/services/checkout.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private checkoutService: CheckoutService
  ) {}

 async create(booking: BookingDTO) {
    booking.bookingId = uuidv4();
    const checkout = await (await (this.checkoutService.doCheckout({
      booking: {
        bookingId: booking.bookingId,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
        currency: booking.currency,
        language: booking.language,
        market: booking.market,
        totalAmount: booking.amount,
        koURL: booking.koUrl,
        okURL: booking.okUrl,
      },
    })))['data'];
    const prebooking: Booking = {...booking, bookingId: booking.bookingId, checkoutId: checkout.checkoutId}; 
    const createdBooking = new this.bookingModel(prebooking);
    await createdBooking.save();
    return {bookingId:  prebooking.bookingId};
  }

  findById(id: string) {
    return this.bookingModel.findOne({bookingId: id}).exec();
  }
}
