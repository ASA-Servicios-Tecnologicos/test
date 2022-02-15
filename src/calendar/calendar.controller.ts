import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReferencePricesRequestDTO } from '../shared/dto/calendar.dto';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('reference-prices')
  getReferencePrices(@Body() requestDTO: ReferencePricesRequestDTO) {
    return this.calendarService.getReferencePrices(requestDTO);
  }
}
