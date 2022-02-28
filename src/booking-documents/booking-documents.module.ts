import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { BookingDocumentsService } from './services/booking-documents.service';
@Module({
  imports: [AppConfigModule, HttpModule],
  controllers: [],
  providers: [BookingDocumentsService],
  exports: [BookingDocumentsService],
})
export class CheckoutModule {}
