import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User, Task, Role, Organization } from '@task-management/data';
import { AuthModule } from '../auth.module';
import { TasksModule } from '../tasks.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from '../rbac/permission.guard';


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

  providers: [
  {
    provide: APP_GUARD,
    useClass: PermissionGuard,
  },
],
})
export class AppModule {}
