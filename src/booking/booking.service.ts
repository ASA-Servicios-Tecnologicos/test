import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';
import { CheckoutService } from '../checkout/services/checkout.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private checkoutService: CheckoutService
  ) {}

  create(booking: BookingDTO) {
    const checkout = this.checkoutService.doCheckout({
      booking: {
        bookingId: booking.id,
        startDate: booking.checkIn,
        endDate: booking.checkOut,
        currency: booking.currency,
        language: booking.language,
        market: booking.market,
        totalAmount: booking.amount,
        koURL: '',
        okURL: '',
      },
    });
    const createdBooking = new this.bookingModel(booking);
    const save = createdBooking.save();

    return checkout;
  }

  findById(id: string) {
    return this.bookingModel.findById(id).exec();
  }
}
