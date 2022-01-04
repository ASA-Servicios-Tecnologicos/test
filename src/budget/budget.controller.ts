import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingDTO } from '../shared/dto/booking.dto';
import { BudgetService } from './budget.service';

@Controller('budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un presupuesto' })
  @ApiResponse({ status: 201, description: 'Presupuest creado.' })
  create(@Body() budget: BookingDTO) {
    return this.budgetService.create(budget);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un presupuesto' })
  @ApiResponse({ status: 200, description: 'Devuelve presupuesto.' })
  @ApiResponse({ status: 404, description: 'Presupuesto no encontrado.' })
  findBudgetById(@Param('id') id: string) {
    return this.budgetService.findById(id);
  }

  @Get('bycheckout/:checkoutId')
  findBudgetByCheckoutId(@Param('checkoutId') checkoutId: string) {}

  @Post('confirm/:id')
  confirmBudget(@Param('id') id: string) {}
}
