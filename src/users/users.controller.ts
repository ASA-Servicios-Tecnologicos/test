import { Body, Controller, Post } from '@nestjs/common';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';
import { UsersService } from './users.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() loginPayload: LoginPayloadDTO): Promise<{ token: string }> {
    try {
      return this.usersService.login(loginPayload);
    } catch (e) {
      console.log(e);
    }
  }
}
