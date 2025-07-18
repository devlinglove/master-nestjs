import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  //Unique,
  UpdateDateColumn,
} from 'typeorm';
//import { BaseEntity } from 'src/common/BaseEntity';
import { Task } from './task.entity';

@Entity()
//@Unique(['name', 'taskId'])
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  @Index()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
