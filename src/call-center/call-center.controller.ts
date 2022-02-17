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
  getDossiersByAgency(@Req() request: Request, @Query() filterParams: CallCenterBookingFilterParamsDTO) {
    const agencyId = request['agencyId'];
    if (!agencyId) {
      throw new NotFoundException('Agency not found');
    }
    return this.callCenterService.getDossiersByAgencyId(agencyId, pickBy(filterParams));
  }

  @Patch('dossiers/:id')
  patchDossierById(@Param('id') id: number, dossierToUpdate) {}
}
