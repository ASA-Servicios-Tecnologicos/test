import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { CallCenterBookingFilterParamsDTO, ManagementDossierByAgency } from '../shared/dto/call-center.dto';
import { CallCenterService } from './call-center.service';

@Controller('call-center')
export class CallCenterController {
  constructor(private readonly callCenterService: CallCenterService) {}

  @Get('dossiers')
  getDossiersByAgency(@Req() request: Request, filterParams: CallCenterBookingFilterParamsDTO): Promise<ManagementDossierByAgency> {
    const agencyId = request['agencyId'];
    if (!agencyId) {
    }
    return this.callCenterService.getDossiersByAgencyId(agencyId, filterParams);
  }
}
