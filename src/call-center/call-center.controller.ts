import { Body, Controller, Get, NotFoundException, Param, Patch, Query, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { pickBy } from 'lodash';
import { DossiersService } from '../dossiers/dossiers.service';
import { ClientService } from '../management/services/client.service';
import { CallCenterBookingFilterParamsDTO, ManagementDossierByAgency } from '../shared/dto/call-center.dto';
import { DossierClientDTO } from '../shared/dto/dossier-client.dto';
import { CallCenterService } from './call-center.service';

@Controller('call-center')
export class CallCenterController {
  constructor(private readonly callCenterService: CallCenterService, private readonly clientsService: ClientService) {}

  @Get('dossiers')
  getDossiersByAgency(@Req() request: Request, @Query() filterParams: CallCenterBookingFilterParamsDTO) {
    const agencyId = request['agencyId'];
    if (!agencyId) {
      throw new NotFoundException('Agency not found');
    }
    return this.callCenterService.getDossiersByAgencyId(agencyId, pickBy(filterParams));
  }

  @Patch('clients/:id')
  patchDossierClientById(@Param('id') id: string, @Body() dossierClientDto: DossierClientDTO) {
    return this.clientsService.patchClientById(`${id}`, dossierClientDto);
  }
}
