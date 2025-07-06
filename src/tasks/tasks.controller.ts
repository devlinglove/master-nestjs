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
  Query,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { CreateTaskLabelDto } from './task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';
import { PaginatedResponse } from 'src/common/pagination.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public async findAll(
    @Query() findParams: FindTaskParams,
    @Query() paginParams: PaginationParams,
  ): Promise<PaginatedResponse<Task>> {
    const [items, count] = await this.tasksService.findAll(
      findParams,
      paginParams,
    );
    return {
      data: items,
      meta: {
        total: count,
        ...paginParams,
      },
    };
  }
  @Get('/:id')
  public async findOne(@Param() params: { id: string }): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() createDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createDto);
  }

  @Post('/:id/labels')
  public async createTaskLabels(
    @Param() params: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    return await this.tasksService.addLabels(task, labels);
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
