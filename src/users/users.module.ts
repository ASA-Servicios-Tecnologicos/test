import { Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { ManagementModule } from '../management/management.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ManagementModule, AppConfigModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
