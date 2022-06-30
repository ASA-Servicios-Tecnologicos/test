import { CreatePriceHistoryDto, PriceHistoryFilterParamsDTO } from './../shared/dto/booking-service.dto';
import { InfoPayment } from './../shared/dto/dossier-payment.dto';
import { DossierDto } from 'src/shared/dto/dossier.dto';
import { CreateDossierPaymentDTO, DossierPaymentInstallment, InfoDossierPayments } from 'src/shared/dto/dossier-payment.dto';
import { HeadersDTO } from './../shared/dto/header.dto';
import { Controller, Get, Param, Query, Headers, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingServicesService } from 'src/management/services/booking-services.service';

import { PaymentsService } from '../payments/payments.service';
import { CheckoutService } from '../checkout/services/checkout.service';
import { DossiersService } from '../dossiers/dossiers.service';

import { BookingServicesServiceLocal } from './booking-services.service';

import { logger } from '../logger';
import { pickBy } from 'lodash';
import { CallCenterService } from 'src/call-center/call-center.service';

@Controller('booking-services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
    private readonly dossiersService: DossiersService,
    private readonly bookingServicesServiceLocal: BookingServicesServiceLocal,
    private readonly callCenterService: CallCenterService,
  ) {}

  @Get('price-history')
  @ApiOperation({ summary: 'Obtener price history of booking service de un dossier' })
  @ApiResponse({ status: 200, description: 'Booking services encontrados' })
  getPriceHistory(@Query() filterParams: PriceHistoryFilterParamsDTO, @Headers() headers?: HeadersDTO) {
    return this.bookingServicesServiceLocal.getPriceHistory({ ...pickBy(filterParams) }, headers);
  }

  @Post('price-history')
  createPriceHistory(@Body() body: CreatePriceHistoryDto, @Headers() headers?: HeadersDTO): Promise<any> {
    return this.bookingServicesServiceLocal.createPriceHistory(body, headers);
  }

  @Get(':bookingServiceId')
  @ApiOperation({ summary: 'Obtener booking services de un dossier' })
  @ApiResponse({ status: 200, description: 'Booking services encontrados' })
  async create(@Param('bookingServiceId') bookingServiceId: string, @Query('force') force: string, @Headers() headers?: HeadersDTO) {
    const data = await this.bookingServicesService.getBookingServiceById(bookingServiceId, force, headers);

    logger.info(`[BookingServicesController] [create]  el status de reserva del servicio ${bookingServiceId} es ${data.provider_status}`);
    data.provider_status = 'CANCELLED';
    if (data.provider_status === 'CANCELLED') {
      logger.info(`[BookingServicesController] [create]  cancelling payments...`);

      const dossier: DossierDto = await this.dossiersService.findDossierById(data.dossier.id.toString());

      if (dossier.dossier_payments && dossier.dossier_payments.length) {
        const filteredPayments: DossierPaymentInstallment = dossier.dossier_payments.find((payment) => {
          return !['COMPLETED', 'COMPLETED_AGENT', 'ERROR', 'CANCELLED'].includes(payment.status);
        });

        if (filteredPayments) {
          await this.callCenterService.cancelDossier(dossier.id.toString());
        }
      }
    } else {
      const historyPrice = await this.bookingServicesServiceLocal.getPriceHistory({ booking_service: bookingServiceId });
      console.log(historyPrice);
    }

    return data;
  }
}
