import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema, ConfigType } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { authConfig } from './config/auth.config';
import { UsersModule } from './users/users.module';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';
import { TaskLabel } from './tasks/task-label.entity';
import { AuthModule } from './auth/auth.module';

// forRootAsync is the dynamic loading configuration module (run-time)
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        return {
          ...dbConfig,
          entities: [Task, User, TaskLabel],
        };
      },
    }),
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig, authConfig],
      isGlobal: true,
      validationSchema: appConfigSchema,
      validationOptions: {
        //allowUnknown: false,
        abortEarly: true,
      },
    }),
    //TypeOrmModule.forRoot(typeOrmConfig()),
    TaskModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: TypedConfigService,
    //   useExisting: ConfigService,
    // },
    // Dynamic loading
  ],
})
export class AppModule {}
