import { Controller, Get, NotFoundException, Param, Patch, Query, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { pickBy } from 'lodash';
import { DossiersService } from '../dossiers/dossiers.service';
import { CallCenterBookingFilterParamsDTO, ManagementDossierByAgency } from '../shared/dto/call-center.dto';
import { CallCenterService } from './call-center.service';

@Controller('call-center')
export class CallCenterController {
  constructor(private readonly callCenterService: CallCenterService, private readonly dossiersService: DossiersService) {}

  @Get('dossiers')
  getDossiersByAgency(
    @Req() request: Request,
    @Query('code') code: string,
    @Query('locator') locator: string,
    @Query('client') client: string,
    @Query('page') page: string,
    @Query('opening_date_from') opening_date_from: string,
    @Query('opening_date_to') opening_date_to: string,
  ) {
    const agencyId = request['agencyId'];
    if (!agencyId) {
      throw new NotFoundException('Agency not found');
    }
    const filterParams: CallCenterBookingFilterParamsDTO = {
      code,
      locator,
      client,
      page,
      opening_date_from,
      opening_date_to,
    };
    return this.callCenterService.getDossiersByAgencyId(agencyId, pickBy(filterParams));
  }

  @Patch('dossiers/:id')
  patchDossierById(@Param('id') id: number, dossierToUpdate) {}
}
