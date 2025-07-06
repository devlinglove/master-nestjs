import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { LoginResponse } from './login-response';
//import { UserService } from './user/user.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class UsersController {
  constructor(
    private authService: AuthService,
    //private userService: UserService,
  ) {}

  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(loginDto);
    return accessToken;
  }

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }
}
