import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateBudgetDto, ManagementBudgetDto } from '../shared/dto/budget.dto';
import { CreateBudgetResponseDTO } from '../shared/dto/create-budget-response.dto';
import { BudgetService } from './budget.service';

@Controller('budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un presupuesto' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Presupuesto creado.' })
  create(@Body() budget: CreateBudgetDto): Promise<CreateBudgetResponseDTO> {
    return this.budgetService.create(budget);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un presupuesto' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Devuelve presupuesto.', type: ManagementBudgetDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Presupuesto no encontrado.' })
  findBudgetById(@Param('id') id: string): Promise<ManagementBudgetDto> {
    return this.budgetService.findById(id);
  }

  //   @Get('bycheckout/:checkoutId')
  //   findBudgetByCheckoutId(@Param('checkoutId') checkoutId: string) {}

  //   @Post('confirm/:id')
  //   confirmBudget(@Param('id') id: string) {}
}
