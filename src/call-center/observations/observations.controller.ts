import { ObservationsService } from './observations.service';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
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

    @Post()
    createObservation(
      @Body() observation: any,
    ): Promise<any> {
      return this.observationsService.createObservation(observation);
    }

    @Put()
    updateObservation(
      @Body() observation: any,
    ): Promise<any> {
      return this.observationsService.updateObservation(observation);
    }

}
