import { HeadersDTO } from './../shared/dto/header.dto';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, Req, Headers } from '@nestjs/common';
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
  ) {}

  @Get('dossiers')
  getDossiersByAgency(@Req() request: Request, @Query() filterParams: CallCenterBookingFilterParamsDTO, @Headers() headers?: HeadersDTO) {
    const agencyId = request['agencyId'];
    if (!agencyId) {
      throw new NotFoundException('Agency not found');
    }
    return this.callCenterService.getDossiersByAgencyId(agencyId, { ...pickBy(filterParams) }, headers);
  }

  @Get('budgets')
  getBudgetsByAgency(@Req() request: Request, @Query() filterParams: CallCenterBookingFilterParamsDTO, @Headers() headers?: HeadersDTO) {
    const agencyId = request['agencyId'];
    if (!agencyId) {
      throw new NotFoundException('Agency not found');
    }
    return this.callCenterService.getBudgetsByAgencyId(agencyId, { ...pickBy(filterParams) }, headers);
  }

  @Post('email/:dossierId')
  sendConfirmationEmail(@Param('dossierId') dossierId: string, @Headers() headers?: HeadersDTO) {
    return this.callCenterService.sendConfirmationEmail(dossierId, headers);
  }

  @Patch('clients/:id')
  patchDossierClientById(@Param('id') id: string, @Body() dossierClientDto: Partial<DossierClientDTO>, @Headers() headers?: HeadersDTO) {
    return this.clientsService.patchClientById(`${id}`, dossierClientDto, headers);
  }

  @Patch('services/:id')
  patchDossierServiceById(
    @Param('id') id: string,
    @Body() dossierServiceDTO: Partial<ManagementBookingServiceDTO>,
    @Headers() headers?: HeadersDTO
  ): Promise<ManagementBookingServiceDTO> {
    return this.bookingServicesService.patchBookingServiceById(Number(id), dossierServiceDTO, headers);
  }

  @Patch('dossier/:id')
  patchDossierById(@Param('id') id: string, @Body() newDossier, @Headers() headers?: HeadersDTO) {
    return this.dossiersService.patchDossierById(Number(id), newDossier, headers);
  }

  @Get('dossier/:id')
  getDossierById(@Param('id') id: string, @Headers() headers?: HeadersDTO) {
    return this.dossiersService.findDossierById(id, headers);
  }

  @Post('services/:id/paxes')
  createBookingServicePax(@Param('id') serviceId: string, @Body() pax: Partial<CreateUpdateBookingServicePax>, @Headers() headers?: HeadersDTO): Promise<Pax> {
    return this.bookingServicesService.createBookingServicePax(serviceId, pax, headers);
  }

  @Put('services/paxes/:paxId/')
  patchBookingServicePaxById(@Param('paxId') paxId: string, @Body() pax: Partial<CreateUpdateBookingServicePax>, @Headers() headers?: HeadersDTO) {
    return this.bookingServicesService.putBookingServiceByServiceAndPaxId(paxId, pax, headers);
  }

  @Delete('services/paxes/:paxId')
  deleteBookingServicePax(@Param('paxId') id: string, @Headers() headers?: HeadersDTO): Promise<void> {
    return this.bookingServicesService.deleteBookingServicePaxById(Number(id), headers);
  }

  @Post('dossier/cancel/:dossierId')
  @ApiOperation({ summary: 'Cancela la reserva y los pagos recurrentes pendientes a nivel de checkout. Actualiza el estado del dossier' })
  cancelDossier(@Param('dossierId') dossierId: string, @Headers() headers?: HeadersDTO) {
    return this.callCenterService.cancelDossier(dossierId, headers);
  }
}
