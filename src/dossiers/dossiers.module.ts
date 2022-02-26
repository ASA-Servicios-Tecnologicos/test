import { Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { ManagementModule } from '../management/management.module';
import { DossiersService } from './dossiers.service';

@Module({ imports: [ManagementModule, AppConfigModule], controllers: [], providers: [DossiersService], exports: [DossiersService] })
export class DossiersModule {}
