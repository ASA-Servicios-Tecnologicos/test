import { Module } from '@nestjs/common';
import { DossiersService } from './dossiers.service';

@Module({ imports: [], controllers: [], providers: [DossiersService], exports: [DossiersService] })
export class DossiersModule {}
