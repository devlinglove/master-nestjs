import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import {
  ConflictException,
  Injectable,

} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '../users/user.entity';
import { PasswordService } from './password/password.service';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  public async login(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await this.passwordService.verify(
      password,
      user.password,
    );
    if (!isValidPassword) {
      return null;
    }
    return user;
  }

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );

    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.userService.createUser(userWithHashedPassword);
  }

  public generateToken(user: User) {
    const payload = { name: user.name, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
