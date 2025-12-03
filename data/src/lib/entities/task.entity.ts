import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  category!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => Organization)
  organization!: Organization;

  @ManyToOne(() => User)
  createdBy!: User;
}
