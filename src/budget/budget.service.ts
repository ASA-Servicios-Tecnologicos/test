import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDTO } from '../shared/dto/booking.dto';
import { Booking, BookingDocument } from '../shared/model/booking.schema';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>
  ) {}

  async create(booking: BookingDTO) {
    const createdBooking = new this.bookingModel({
      ...booking,
      checkoutId: 'checkoutid',
    });
    const save = await createdBooking.save();
    return save._id;
  }

  findById(id: string) {
    return this.bookingModel.findById(id);
  }
}
