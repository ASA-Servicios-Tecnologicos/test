import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private http: HttpService) {}

  notify() {}
}
