import { Module } from '@nestjs/common';
import { ManagementModule } from '../management/management.module';
import { BookingPackagesController } from './booking-packages.controller';
import { BookingPackagesService } from './booking-packages.service';

@Module({
  imports: [ManagementModule],
  providers: [BookingPackagesService],
  controllers: [BookingPackagesController],
  exports: [],
})
export class BookingPackagesModule {}
