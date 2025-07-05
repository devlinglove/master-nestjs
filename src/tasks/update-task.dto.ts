//import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
//import { TaskStatus } from './task.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// export class UpdateTaskDto {
//   @IsNotEmpty()
//   @IsEnum(TaskStatus)
//   status: TaskStatus;
//   @IsNotEmpty()
//   @IsUUID()
//   userId: string;
// }

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
