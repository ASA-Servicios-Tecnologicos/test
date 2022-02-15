import { Body, Controller, Get } from '@nestjs/common';
import { ReferencePricesRequestDTO } from '../shared/dto/calendar.dto';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService:CalendarService) {}
  @Get('reference-prices')
  getReferencePrices(@Body() requestDTO: ReferencePricesRequestDTO) {
	  return this.calendarService.
  }
}
