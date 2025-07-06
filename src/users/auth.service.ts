import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { PasswordService } from './password/password.service';
import { LoginDto } from './login.dto';
import { LoginResponse } from './login-response';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  public async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await this.passwordService.verify(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateToken(user);
    const userWithToken = Object.assign(new LoginResponse(), user, { token });
    return userWithToken;
  }

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return this.userService.createUser(createUserDto);
  }

  private generateToken(user: User) {
    const payload = { name: user.name, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
