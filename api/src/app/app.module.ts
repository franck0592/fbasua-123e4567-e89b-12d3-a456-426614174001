import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User, Task, Role, Organization } from '@task-management/data';
//import { AuthModule } from '../auth/auth.module';
//import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from '../auth.module';
import { TasksModule } from '../tasks.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Task, Role, Organization],
      synchronize: true, // enable for dev only
      autoLoadEntities: true,
    }),

    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
