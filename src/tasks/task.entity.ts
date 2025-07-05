import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskLabel } from './task-label.entity';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @OneToMany(() => TaskLabel, (tLabel) => tLabel.task, {
    cascade: true,
  })
  labels: TaskLabel[];
}
