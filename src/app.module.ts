import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authConfig } from './config/auth.config';
import { UsersModule } from './users/users.module';

// forRootAsync is the dynamic loading configuration module (run-time)
@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: TypedConfigService) => ({
    //     ...configService.get('database'),
    //     entities: [Task, User, TaskLabel],
    //   }),
    // }),
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        //allowUnknown: false,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    TaskModule,
    UsersModule,
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
