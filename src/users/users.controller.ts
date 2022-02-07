import { Body, Controller, Post } from '@nestjs/common';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() loginPayload: LoginPayloadDTO): Promise<{ token: string }> {
    return this.usersService.login(loginPayload);
  }
}
