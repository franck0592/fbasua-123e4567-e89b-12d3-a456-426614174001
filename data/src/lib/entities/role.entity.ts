import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // OWNER, ADMIN, VIEWER

  @Column("simple-array")
  permissions!: string[];

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
