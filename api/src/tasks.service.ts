import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Task } from '@task-management/data';
import { Organization } from '@task-management/data';
import { User } from '@task-management/data';

import { CreateTaskDto, UpdateTaskDto } from '@task-management/data';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Helper: Get all sub-org IDs (Org + children)
  async getAccessibleOrgIds(orgId: number): Promise<number[]> {
    const orgs = await this.orgRepo.find({
      relations: ['children', 'parent'],
    });

    const ids = new Set<number>();

    function addChildren(id: number) {
      ids.add(id);
      orgs
        .filter((o) => o.parent?.id === id)
        .forEach((child) => addChildren(child.id));
    }

    addChildren(orgId);
    return [...ids];
  }

  // ------------------------
  // CREATE TASK
  // ------------------------
  async create(user: any, dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      title: dto.title,
      category: dto.category ?? null,
      completed: false,
      createdBy: { id: user.sub },
      organization: { id: user.orgId },
    });

    return this.taskRepo.save(task);
  }

  // ------------------------
  // LIST TASKS WITH ORG FILTERING
  // ------------------------
  async findAll(user: any) {
    const orgIds = await this.getAccessibleOrgIds(user.orgId);

    return this.taskRepo.find({
      where: { organization: { id: In(orgIds) } },
      relations: ['organization', 'createdBy'],
    });
  }

  // ------------------------
  // UPDATE TASK
  // ------------------------
  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  // ------------------------
  // DELETE TASK
  // ------------------------
  async delete(id: number) {
    const result = await this.taskRepo.delete(id);
    return { deleted: result.affected > 0 };
  }
}
