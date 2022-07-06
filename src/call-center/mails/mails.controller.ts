import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('call-center/mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Post('/send-cancelation')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Mail enviado.' })
  sendCancelation(@Body() data: { dossierId: String }) {
    return this.mailsService.sendCancelation(data);
  }

  @Post('/send-observation')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Mail enviado.' })
  sendObservation(@Body() data: { dossierId: String }) {
    return this.mailsService.sendObservation(data);
  }
}
