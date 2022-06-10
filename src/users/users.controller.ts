import { Body, Controller, Post, HttpException } from '@nestjs/common';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';
import { UsersService } from './users.service';
import { logger } from '../logger';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() loginPayload: LoginPayloadDTO): Promise<{ token: string }>{
   return this.usersService.login(loginPayload).catch((err)=>{ 
    logger.warn(`[UsersController] [login] ${err} --errors ${JSON.stringify(err.response.error)}`)
     throw new HttpException({ message: err.response.message, error: err.response.error || err.response.message }, err.status)
   })
 }

}
