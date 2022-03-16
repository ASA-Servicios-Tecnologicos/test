import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { pickBy } from 'lodash';
import { DossiersService } from '../dossiers/dossiers.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { ClientService } from '../management/services/client.service';
import { ManagementBookingServiceDTO } from '../shared/dto/booking-service.dto';
import { CallCenterBookingFilterParamsDTO, CreateUpdateBookingServicePax, Pax } from '../shared/dto/call-center.dto';
import { DossierClientDTO } from '../shared/dto/dossier-client.dto';
import { CallCenterService } from './call-center.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('call-center')
export class CallCenterController {
  constructor(
    private readonly callCenterService: CallCenterService,
    private readonly clientsService: ClientService,
    private readonly dossiersService: DossiersService,
    private readonly bookingServicesService: BookingServicesService,
  ) { }

  @Get('dossiers')
  getDossiersByAgency(@Req() request: Request, @Query() filterParams: CallCenterBookingFilterParamsDTO) {
    const agencyId = request['agencyId'];
    if (!agencyId) {
      throw new NotFoundException('Agency not found');
    }
    return this.callCenterService.getDossiersByAgencyId(agencyId, { ...pickBy(filterParams) });
  }

  @Post('email/:dossierId')
  sendConfirmationEmail(@Param('dossierId') dossierId: string) {
    return this.callCenterService.sendConfirmationEmail(dossierId);
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

  @Patch('dossier/:id')
  patchDossierById(@Param('id') id: string, @Body() newDossier) {
    return this.dossiersService.patchDossierById(Number(id), newDossier);
  }

  @Post('services/:id/paxes')
  createBookingServicePax(@Param('id') serviceId: string, @Body() pax: Partial<CreateUpdateBookingServicePax>): Promise<Pax> {
    return this.bookingServicesService.createBookingServicePax(serviceId, pax);
  }

  @Put('services/paxes/:paxId/')
  patchBookingServicePaxById(@Param('paxId') paxId: string, @Body() pax: Partial<CreateUpdateBookingServicePax>) {
    return this.bookingServicesService.putBookingServiceByServiceAndPaxId(paxId, pax);
  }

  @Delete('services/paxes/:paxId')
  deleteBookingServicePax(@Param('paxId') id: string): Promise<void> {
    return this.bookingServicesService.deleteBookingServicePaxById(Number(id));
  }

  @Post('dossier/cancel/:dossierId')
  @ApiOperation({ summary: 'Cancela la reserva y los pagos recurrentes pendientes a nivel de checkout. Actualiza el estado del dossier' })
  cancelDossier(@Param('dossierId') dossierId: string) {
    return this.callCenterService.cancelDossier(dossierId);
  }
}
