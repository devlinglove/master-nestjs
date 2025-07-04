import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from './task.entity';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
