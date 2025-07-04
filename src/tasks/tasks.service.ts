import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }
  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOneBy({ id });
  }

  public async deleteTask(task: Task): Promise<void> {
    await this.taskRepository.delete(task);
  }

  public async createTask(creatDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.save(creatDto);
  }

  public async updateTask(task: Task, updateDto: UpdateTaskDto): Promise<Task> {
    if (
      updateDto.status &&
      this.isValidStatusTransition(task.status, updateDto.status)
    ) {
      throw new Error('Wrong task status transition!');
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
}
