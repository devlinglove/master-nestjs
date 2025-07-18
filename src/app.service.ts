import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/config.types';
import { AppConfig } from './config/app.config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<ConfigType>) {}
  getHello(): string {
    const appConfig = this.configService.get<AppConfig>('app');
    const prefix = appConfig.messagePrefix;
    return `${prefix} Hello World!`;
  }
}
