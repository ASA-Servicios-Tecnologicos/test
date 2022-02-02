import { Controller, Get } from '@nestjs/common';
import { CallCenterBookingFilterParamsDTO } from '../shared/dto/call-center.dto';
import { CallCenterService } from './call-center.service';

@Controller('call-center')
export class CallCenterController {
  constructor(private readonly callCenterService: CallCenterService) {}

  @Get('bookings')
  getBookings(filterParams: CallCenterBookingFilterParamsDTO) {
    return this.callCenterService.getBookings(filterParams);
  }
}
