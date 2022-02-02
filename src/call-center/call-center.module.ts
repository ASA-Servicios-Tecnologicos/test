import { Module } from '@nestjs/common';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './call-center.service';

@Module({
  imports: [],
  controllers: [CallCenterController],
  providers: [CallCenterService],
  exports: [],
})
export class CallCenterModule {}
