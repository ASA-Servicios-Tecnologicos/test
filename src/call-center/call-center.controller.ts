import { Body, Controller, Get, NotFoundException, Param, Patch, Query, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { pickBy } from 'lodash';
import { DossiersService } from '../dossiers/dossiers.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { ClientService } from '../management/services/client.service';
import { ManagementBookingServiceDTO } from '../shared/dto/booking-service.dto';
import { CallCenterBookingFilterParamsDTO } from '../shared/dto/call-center.dto';
import { DossierClientDTO } from '../shared/dto/dossier-client.dto';
import { CallCenterService } from './call-center.service';

@Controller('call-center')
export class CallCenterController {
  constructor(
    private readonly callCenterService: CallCenterService,
    private readonly clientsService: ClientService,
    private readonly dossiersService: DossiersService,
    private readonly bookingServicesService: BookingServicesService,
  ) {}

  @Get('dossiers')
  getDossiersByAgency(@Req() request: Request, @Query() filterParams: CallCenterBookingFilterParamsDTO) {
    const agencyId = request['agencyId'];
    if (!agencyId) {
      throw new NotFoundException('Agency not found');
    }
    return this.callCenterService.getDossiersByAgencyId(agencyId, { ...pickBy(filterParams), all_data: true });
  }

  @Patch('clients/:id')
  patchDossierClientById(@Param('id') id: string, @Body() dossierClientDto: Partial<DossierClientDTO>) {
    return this.clientsService.patchClientById(`${id}`, dossierClientDto);
  }

  @Patch('services/:id')
  patchDossierServiceById(
    @Param('id') id: string,
    @Body() dossierServiceDTO: Partial<ManagementBookingServiceDTO>,
  ): Promise<ManagementBookingServiceDTO> {
    return this.bookingServicesService.patchBookingServiceById(Number(id), dossierServiceDTO);
  }

  @Patch('services/:id')
  patchDossierById(@Param('id') id: string, @Body() newDossier) {
    return this.dossiersService.patchDossierById(Number(id), newDossier);
  }
}
