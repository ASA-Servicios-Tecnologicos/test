import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
@Controller('call-center/mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Post('/send-cancelation')
  sendCancelation(@Body() data: { dossierId: String }, @Res() response: Response) {
    return this.mailsService.sendCancelation(data, response);
  }

  @Post('/send-observation')
  sendObservation(@Body() data: { dossierId: String; observation: String }, @Res() response: Response) {
    return this.mailsService.sendObservation(data, response);
  }
}
