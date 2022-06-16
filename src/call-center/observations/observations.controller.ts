import { ObservationsService } from './observations.service';
import { Controller, Get, Query } from '@nestjs/common';
import { pickBy } from 'lodash';
@Controller('call-center/observations')
export class ObservationsController {

    constructor(
        private readonly observationsService: ObservationsService,
      ) {}

    @Get()
    getObservations(@Query() filterParams: any) {
      return this.observationsService.getObservations({ ...pickBy(filterParams) });
    }

}
