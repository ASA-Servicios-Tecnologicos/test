import { Body, Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUpdateDossierPaymentDTO } from 'src/shared/dto/dossier-payment.dto';
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

  @Get(':dossier')
  @ApiOperation({ summary: 'Obtener pagos de un dossier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagos del dossier encontrados' })
  get(@Param('dossier') dossier: string) {
    return this.paymentsService.getDossierPayments(dossier);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar pagos de un dossier' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pagos del dossier actualizados' })
  update(@Body() body: CreateUpdateDossierPaymentDTO) {
    return this.paymentsService.updateDossierPayments(body);
  }

  @Get('update/:checkoutId')
  @ApiOperation({ summary: 'Actualiza y devuelve los pagos del dossier actualizados' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagos del dossier actualizados' })
  updateByCheckoutId(@Param('checkoutId') checkoutId: string) {
    return this.paymentsService.updateDossierPaymentsByCheckout(checkoutId);
  }
}
