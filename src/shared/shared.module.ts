import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';

@Module({
  imports: [],
  providers: [CacheService],
  controllers: [],
  exports: [CacheService],
})
export class SharedModule {}
