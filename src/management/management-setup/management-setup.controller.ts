import { Controller, Get } from '@nestjs/common';
import { ManagementSetupService } from './management-setup.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('management-setup')
export class ManagementSetupController {
  constructor(private readonly managementSetupService: ManagementSetupService) {}

  @Get()
  getManagementSetup(): Promise<any> {
    return this.managementSetupService.getManagementSetup();
  }
}
