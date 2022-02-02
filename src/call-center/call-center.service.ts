import { Injectable } from '@nestjs/common';
import { CallCenterBookingFilterParamsDTO } from '../shared/dto/call-center.dto';

@Injectable()
export class CallCenterService {
  getBookings(filterParams: CallCenterBookingFilterParamsDTO) {}
}
