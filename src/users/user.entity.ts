import { Expose } from 'class-transformer';
import { Task } from 'src/tasks/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;
  @Column()
  @Expose()
  name: string;
  @Column()
  password: string;
  @Column()
  @Expose()
  email: string;
  @CreateDateColumn()
  @Expose()
  createdAt: Date;
  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
