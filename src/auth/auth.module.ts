import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfig } from 'src/config/auth.config';
import { ConfigType } from 'src/config/config.types';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/auth/password/password.service';
import { User } from 'src/users/user.entity';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule,
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
    UsersModule,
  ],
  providers: [AuthService, PasswordService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
