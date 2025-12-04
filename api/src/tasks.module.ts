import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task, Organization, User } from '@task-management/data';
import { OrgService } from './org/org.service';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Organization, User]),
  ],
  controllers: [TasksController],
  providers: [TasksService, OrgService],
})
export class TasksModule {}
