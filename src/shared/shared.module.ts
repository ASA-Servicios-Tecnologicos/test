import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { HtmlTemplateService } from './services/html-template.service';

@Module({
  imports: [],
  providers: [CacheService, HtmlTemplateService],
  controllers: [],
  exports: [CacheService, HtmlTemplateService],
})
export class SharedModule { }
