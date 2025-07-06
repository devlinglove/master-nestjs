import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.types';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { PasswordService } from './password/password.service';
import { UsersController } from './user.constroller';
import { AuthConfig } from 'src/config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigType>) => {
        const jwtConfig = config.get<AuthConfig>('auth');
        return {
          ...jwtConfig,
        };
      },
    }),
    //JwtModule.register(authConfig()),
  ],
  controllers: [UsersController],
  providers: [AuthService, UserService, PasswordService],
})
export class UsersModule {}
