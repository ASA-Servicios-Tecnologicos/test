import { Controller, Post } from '@nestjs/common';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(loginPayload: LoginPayloadDTO) {}
}
