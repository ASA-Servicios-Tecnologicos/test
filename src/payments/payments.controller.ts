import { UpdateDossierPaymentDTO, CreateDossierPaymentDTO } from './../shared/dto/dossier-payment.dto';
import { Body, Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CheckoutService } from '../checkout/services/checkout.service';
import { CreateUpdateDossierPaymentDTO } from '../shared/dto/dossier-payment.dto';
// TODO: Request payload validators and type responses
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService, private checkoutService: CheckoutService) {}

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

  @Post('createByAgente')
  @ApiOperation({ summary: 'Crear un pago de un dossier por un agente' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pago del dossier creado' })
  createPaymentByAgente(@Body() body: CreateDossierPaymentDTO) {
    return this.paymentsService.createDossierPaymentByAgente(body);
  }

  @Put('updateByAgente/:paymentId')
  @ApiOperation({ summary: 'Actualizar un pago de un dossier por un agente' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Pago del dossier actualizado' })
  async updatePaymentByAgente(@Param('paymentId') paymentId: string, @Body() body: UpdateDossierPaymentDTO) {
    if (body.payment_method_id != 2 && body.status_id == 3) {
      const data = await this.checkoutService.cancelPayment(body.checkout_id, body.order_code);
    }
    return this.paymentsService.updateDossierPaymentByAgente(paymentId, body);
  }

  @Get('update/:checkoutId')
  @ApiOperation({ summary: 'Actualiza y devuelve los pagos del dossier actualizados(proveedor)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagos del dossier actualizados' })
  updateByCheckoutId(@Param('checkoutId') checkoutId: string) {
    return this.paymentsService.updateDossierPaymentsByCheckout(checkoutId, true);
  }

  @Get('updateByDossier/:dossierId')
  @ApiOperation({ summary: 'Actualiza y devuelve los pagos del dossier actualizados(call-center)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pagos del dossier actualizados' })
  async updateByDossierId(@Param('dossierId') dossierId: string) {
    const checkoutId = await this.checkoutService.getCheckoutByDossierId(Number(dossierId));
    return this.paymentsService.updateDossierPaymentsByCheckout(checkoutId);
  }
}
