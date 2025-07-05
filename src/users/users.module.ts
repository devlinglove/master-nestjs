import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
//import { ConfigModule, ConfigService } from '@nestjs/config';
//import { ConfigType } from 'src/config/config.types';
import { authConfig } from 'src/config/auth.config';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { PasswordService } from './password/password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService<ConfigType>) => ({
    //     secret: config.get<AuthConfig>('auth').jwt.secret,
    //     expiresIn: config.get<AuthConfig>('auth').jwt.expiredIn,
    //   }),
    // }),
    JwtModule.register(authConfig()),
  ],
  providers: [AuthService, UserService, PasswordService],
})
export class UsersModule {}
