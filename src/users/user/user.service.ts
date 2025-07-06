import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordService: PasswordService,
  ) {}

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  public async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }
}
