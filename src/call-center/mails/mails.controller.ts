import { EmailFiltersDTO } from './../../shared/dto/email.dto';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { MailsService } from './mails.service';
import { Response } from 'express';
@Controller('call-center/mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Post()
  getMails(@Body() data: EmailFiltersDTO) {
    return this.mailsService.getMails(data);
  }

  @Post('/send-cancelation')
  sendCancelation(@Body() data: { dossierId: string }, @Res() response: Response) {
    return this.mailsService.sendCancelation(data, response);
  }

  @Post('/send-observation')
  sendObservation(@Body() data: { dossierId: string; observation: string }, @Res() response: Response) {
    return this.mailsService.sendObservation(data, response);
  }
}
