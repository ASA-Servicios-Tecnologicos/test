import { ClientService } from '../../management/services/client.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('call-center/mails')
export class MailsController {
  constructor(private readonly clientService: ClientService, private readonly mailsService: MailsService) {}

  @Post('/send-cancelation')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Mail enviado.' })
  sendCancelation(@Body() newsletterRequestDTO: { email: string }) {
    return this.mailsService.sendCancelation(newsletterRequestDTO);
  }
}
