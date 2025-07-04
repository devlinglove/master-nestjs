import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public async findAll(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }
  @Get('/:id')
  public async findOne(@Param() params: { id: string }): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() createDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createDto);
  }

  @Put()
  public async update(
    @Param() params: FindOneParams,
    @Body() updateDto: UpdateTaskDto,
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    try {
      await this.tasksService.updateTask(task, updateDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.deleteTask(task);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }
}
