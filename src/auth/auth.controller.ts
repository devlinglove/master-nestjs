import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { User } from 'src/users/user.entity';
import { LoginResponse } from './dtos/login-response';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public login(@Request() req: AuthenticatedRequest): LoginResponse {
    const token = this.authService.generateToken(req.user);
    return Object.assign(new LoginResponse(), req.user, { token });
  }

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }
}
