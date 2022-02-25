import { Controller, Get } from '@nestjs/common';
import { ManagementSetupService } from './management-setup.service';

@Controller('management-setup')
export class ManagementSetupController {
  constructor(private readonly managementSetupService: ManagementSetupService) {}

  @Get()
  getManagementSetup(): Promise<ManagementSetupDTO> {
    return this.managementSetupService.getManagementSetup();
  }
}
