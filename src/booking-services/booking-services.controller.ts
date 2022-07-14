import { CreatePriceHistoryDto, PriceHistoryFilterParamsDTO } from './../shared/dto/booking-service.dto';
import { InfoPayment } from './../shared/dto/dossier-payment.dto';
import { HeadersDTO } from './../shared/dto/header.dto';
import { Controller, Get, Param, Query, Headers, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PaymentsService } from '../payments/payments.service';
import { CheckoutService } from '../checkout/services/checkout.service';
import { DossiersService } from '../dossiers/dossiers.service';

import { BookingServicesServiceLocal } from './booking-services.service';

import { logger } from '../logger';
import { pickBy } from 'lodash';
import { BookingServicesService } from '../management/services/booking-services.service';
import { CallCenterService } from '../call-center/call-center.service';
import { DossierDto } from '../shared/dto/dossier.dto';
import { DossierPaymentInstallment } from '../shared/dto/dossier-payment.dto';

@Controller('booking-services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
    private readonly dossiersService: DossiersService,
    private readonly bookingServicesServiceLocal: BookingServicesServiceLocal,
    private readonly callCenterService: CallCenterService,
    private readonly paymentsService: PaymentsService,
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
  async create(@Param('bookingServiceId') bookingServiceId: string, @Query('force') force: string) {
    const data = await this.bookingServicesService.getBookingServiceById(bookingServiceId, force);

    logger.info(`[BookingServicesController] [create]  el status de reserva del servicio ${bookingServiceId} es ${data.provider_status}`);

    const dossier: DossierDto = await this.dossiersService.findDossierById(data.dossier.id.toString());

    if (data.provider_status === 'CANCELLED') {
      logger.info(`[BookingServicesController] [create]  cancelling payments...`);

      if (dossier.dossier_payments && dossier.dossier_payments.length) {
        const filteredPayments: DossierPaymentInstallment = dossier.dossier_payments.find((payment) => {
          return !['COMPLETED', 'COMPLETED_AGENT', 'ERROR', 'CANCELLED'].includes(payment.status);
        });

        if (filteredPayments) {
          await this.callCenterService.cancelDossier(dossier.id.toString());
        }
      }
    } else {
      const totalPayments = +dossier.dossier_payments
        .reduce((previousValue, currentValue) => previousValue + currentValue.paid_amount, 0)
        .toFixed(2);

      const tpvp = +dossier.services[0].total_pvp.toFixed(2);
      const tpaid = tpvp - totalPayments;

      logger.info(`[BookingServicesController] [create]  --tpvp ${tpvp} --totalPayments ${totalPayments} `);

      if (tpaid != 0) {
        const new_paymet = {
          dossier_id: dossier.id,
          paid_amount: tpaid,
          status_id: 3,
          observation: `${tpaid > 0 ? 'Cobro' : 'Devolución'} por diferencia de precio`,
        };
        const newPayment = await this.paymentsService.createDossierPaymentByAgente(new_paymet);
        console.log(newPayment);
      }
    }

    return data;
  }
}
