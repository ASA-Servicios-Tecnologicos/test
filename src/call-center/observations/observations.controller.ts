import { HeadersDTO } from './../../shared/dto/header.dto';
import { ObservationsService } from './observations.service';
import { Body, Controller, Get, Post, Put, Query, Headers } from '@nestjs/common';
import { pickBy } from 'lodash';
@Controller('call-center/observations')
export class ObservationsController {

    constructor(
        private readonly observationsService: ObservationsService,
      ) {}

    @Get()
    getObservations(@Query() filterParams: any, 
    @Headers() headers?: HeadersDTO) {
      return this.observationsService.getObservations({ ...pickBy(filterParams) }, headers);
    }

    @Post()
    createObservation(
      @Body() observation: any,
      @Headers() headers?: HeadersDTO
    ): Promise<any> {
      return this.observationsService.createObservation(observation, headers);
    }

    @Put()
    updateObservation(
      @Body() observation: any, 
      @Headers() headers?: HeadersDTO
    ): Promise<any> {
      return this.observationsService.updateObservation(observation, headers);
    }

}
