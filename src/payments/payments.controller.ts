import { Body, Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUpdateDossierPaymentDTO } from 'src/shared/dto/dossier-payment.dto';
import { BookingDTO } from '../shared/dto/booking.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear pagos de un dossier' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pagos creados' })
  create(@Body() body: CreateUpdateDossierPaymentDTO) {
    return this.paymentsService.createDossierPayments(body);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener pagos de un dossier' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pagos del dossier encontrados' })
  get(@Body() body: CreateUpdateDossierPaymentDTO) {
    return this.paymentsService.createDossierPayments(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar pagos de un dossier' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pagos del dossier actualizados' })
  update(@Param('id') id: string) {
    return this.paymentsService.getDossierPayments(id);
  }

  @Get('update/:checkoutId')
  @ApiOperation({ summary: 'Actualiza y devuelve los pagos del dossier actualizados' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pagos del dossier actualizados' })
  updateByCheckoutId(@Param('checkoutId') id: string) {
    return this.paymentsService.updateDossierPaymentsByCheckout(id);
  }
}
