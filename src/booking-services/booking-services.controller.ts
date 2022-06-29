import { InfoPayment } from './../shared/dto/dossier-payment.dto';
import { DossierDto } from 'src/shared/dto/dossier.dto';
import { CreateDossierPaymentDTO, DossierPaymentInstallment, InfoDossierPayments } from 'src/shared/dto/dossier-payment.dto';
import { HeadersDTO } from './../shared/dto/header.dto';
import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingServicesService } from 'src/management/services/booking-services.service';

import { PaymentsService } from '../payments/payments.service';
import { CheckoutService } from '../checkout/services/checkout.service';
import { DossiersService } from '../dossiers/dossiers.service';

import { BookingServicesServiceLocal } from './booking-services.service';

import { logger } from '../logger';
import { pickBy } from 'lodash';

@Controller('booking-services')
export class BookingServicesController {
  constructor(
    private readonly bookingServicesService: BookingServicesService,
    private readonly paymentsService: PaymentsService,
    private readonly checkoutService: CheckoutService,
    private readonly dossiersService: DossiersService,
    private readonly BookingServicesServiceLocal: BookingServicesServiceLocal,
  ) {}

  @Get('price-history')
  @ApiOperation({ summary: 'Obtener price history of booking service de un dossier' })
  @ApiResponse({ status: 200, description: 'Booking services encontrados' })
  getPriceHistory(@Query() filterParams: any, @Headers() headers?: HeadersDTO) {
    return this.BookingServicesServiceLocal.getPriceHistory({ ...pickBy(filterParams) }, headers);
  }

  @Get(':bookingServiceId')
  @ApiOperation({ summary: 'Obtener booking services de un dossier' })
  @ApiResponse({ status: 200, description: 'Booking services encontrados' })
  async create(@Param('bookingServiceId') bookingServiceId: string, @Query('force') force: string, @Headers() headers?: HeadersDTO) {
    const data = await this.bookingServicesService.getBookingServiceById(bookingServiceId, force, headers);

    logger.info(`[BookingServicesController] [create]  el status de reserva del servicio ${bookingServiceId} es ${data.provider_status}`);

    if (true /*data.provider_status == 'CANCELLED'*/) {
      logger.info(`[BookingServicesController] [create]  cancelling payments...`);

      const infoDossierPayments: InfoDossierPayments = await this.paymentsService.getDossierPayments(data.dossier.id.toString());
      //Falta cambiar el de arriba por el de abajo para obtener la informacion completa de un dossier para saber si no es tarjeta
      //const dossier: DossierDto = await this.dossiersService.findDossierById((data.dossier.id).toString());

      const filteredPayments: InfoPayment[] = infoDossierPayments.dossier_payments.filter((x) => {
        return x.status != 'COMPLETED' && x.status != 'COMPLETED_AGENT' && x.status != 'ERROR' && x.status != 'CANCELLED';
      });

      if (filteredPayments.length > 0) {
        const checkoutId = await this.checkoutService.getCheckoutByDossierId(data.dossier.id);

        this.checkoutService
          .cancelCheckout(checkoutId)
          .then(() => {
            logger.info(`[BookingServicesController] [create]  payments cancelled for ${data.dossier.id}`);

            this.paymentsService.updateDossierPaymentsByCheckout(checkoutId).catch((error) => {
              logger.warning(`[BookingServicesController] [create]  payments not update for ${error.stack}`);
            });
          })
          .catch((error) => {
            logger.warning(`[BookingServicesController] [create]  payments not cancelled  ${error.stack}`);
          });
      }
    }

    return data;
  }
}
