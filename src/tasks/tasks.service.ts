import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { TaskLabel } from './task-label.entity';
import { CreateTaskLabelDto } from './task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private taskLabelRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(
    findTaskParams: FindTaskParams,
    paginParams: PaginationParams,
  ): Promise<[Task[], number]> {
    // const whereFilter: FindOptionsWhere<Task> = {};
    // if (findTaskParams.status) {
    //   whereFilter.status = findTaskParams.status;
    // }
    // if (findTaskParams.search && findTaskParams.search.trim()) {
    //   whereFilter.name = Like(`%${findTaskParams.search}%`);
    //   //whereFilter.description = Like(`%${findTaskParams.search}%`);
    // }
    // return await this.taskRepository.findAndCount({
    //   where: whereFilter,
    //   skip: paginParams.offset,
    //   take: paginParams.limit,
    // });

    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels');
    if (findTaskParams.status) {
      query.andWhere('task.status=:status', { status: findTaskParams.status });
    }
    if (findTaskParams.search) {
      query.andWhere(
        '(task.name ILIKE :search OR task.description ILIKE :search)',
        { search: `%${findTaskParams.search}%` },
      );
    }

    if (findTaskParams.labels && findTaskParams.labels.length > 0) {
      query.andWhere('labels.name IN (:...names)', {
        names: findTaskParams.labels,
      });
    }

    query.skip(paginParams.offset).take(paginParams.limit);
    return query.getManyAndCount();
  }
  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async deleteTask(task: Task): Promise<void> {
    await this.taskRepository.delete(task.id);
  }

  public async addLabels(
    task: Task,
    labelDtos: CreateTaskLabelDto[] = [],
  ): Promise<Task> {
    let taskLabels: TaskLabel[] = [];
    const existingLabels = new Set(task.labels.map((label) => label.name));
    if (labelDtos.length > 0) {
      taskLabels = this.getUniqueLabels(labelDtos)
        .filter((item) => !existingLabels.has(item.name))
        .map((item) => this.taskLabelRepository.create(item));
      task.labels = [...task.labels, ...taskLabels];
      return await this.taskRepository.save(task);
    }
    return task;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }

  public async updateTask(task: Task, updateDto: UpdateTaskDto): Promise<Task> {
    if (
      updateDto.status &&
      this.isValidStatusTransition(task.status, updateDto.status)
    ) {
      throw new Error('Wrong task status transition!');
    }

    if (updateDto.labels) {
      updateDto.labels = this.getUniqueLabels(updateDto.labels);
    }

    Object.assign(task, updateDto);
    return await this.taskRepository.save(task);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];
    return uniqueNames.map((name) => ({ name }));
  }
}
