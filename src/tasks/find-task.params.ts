import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from './task.entity';
import { Transform } from 'class-transformer';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;

    return value
      .split(',')
      .map((label) => label.trim())
      .filter((label) => label.length > 0);
  })
  labels: string[];
}
