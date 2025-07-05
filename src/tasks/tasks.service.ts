import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { TaskLabel } from './task-label.entity';
import { CreateTaskLabelDto } from './task-label.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private taskLabelRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
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
