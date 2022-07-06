import { PackagesNewblueService } from './../management/services/packages-newblue.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ReferencePricesRequestDTO } from '../shared/dto/calendar.dto';
import { CalendarService } from './calendar.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('calendar')
export class CalendarController {
  constructor(
    /*private readonly calendarService: CalendarService,*/ 
    private readonly packagesNewBlueService: PackagesNewblueService
  ) {}

  @Post('ota/reference-prices')
  getOtaReferencePrices(@Body() requestDTO: ReferencePricesRequestDTO) {
    //return this.calendarService.getReferencePrices(requestDTO);
    return this.packagesNewBlueService.postPackagesNewblueReferencePrices(requestDTO);
  }

  @Post('reference-prices')
  getReferencePrices(@Body() requestDTO: ReferencePricesRequestDTO) {
    //return this.calendarService.getReferencePrices(requestDTO);
    return this.packagesNewBlueService.postPackagesNewblueReferencePrices(requestDTO);
  }
}
