import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { BookingDocumentsService } from './services/booking-documents.service';
@Module({
  imports: [HttpModule, AppConfigModule],
  controllers: [],
  providers: [BookingDocumentsService],
  exports: [BookingDocumentsService],
})
export class BookingDocumentsModule {}
