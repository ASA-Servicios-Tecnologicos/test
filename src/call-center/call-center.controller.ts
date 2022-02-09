import { Controller, Get, Param } from '@nestjs/common';
import { CallCenterBookingFilterParamsDTO, ManagementDossierByAgency } from '../shared/dto/call-center.dto';
import { CallCenterService } from './call-center.service';

@Controller('call-center')
export class CallCenterController {
  constructor(private readonly callCenterService: CallCenterService) {}

  @Get('agency/:agencyId/dossiers')
  getDossiersByAgency(
    @Param('agencyId') agencyId: string,
    filterParams: CallCenterBookingFilterParamsDTO,
  ): Promise<ManagementDossierByAgency> {
    return this.callCenterService.getDossiersByAgencyId(agencyId, filterParams);
  }
}
