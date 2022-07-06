import { NotificationService } from 'src/notifications/services/notification.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private readonly notificationService: NotificationService) {}

  async sendCancelation(newsletterRequestDTO: { email: string }) {
    this.notificationService.sendCancelation(newsletterRequestDTO.email);
  }
}
