import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;

  @ManyToOne(() => Organization, (org) => org.users)
  organization!: Organization;
}
