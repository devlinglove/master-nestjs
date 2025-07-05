import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { PasswordService } from './password/password.service';
import { LoginDto } from './login.dto';

export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await this.passwordService.verify(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
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
    return this.jwtService.sign({ name: user.name, sub: user.id });
  }
}
