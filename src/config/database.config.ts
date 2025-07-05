import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TaskLabel } from 'src/tasks/task-label.entity';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';

export const typeOrmConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Task, User, TaskLabel],
    synchronize: true,
  }),
);
