import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@task-management/data';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwt: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({
      where: { email },
      relations: ['role', 'organization'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    return {
      token: this.jwt.sign({
        sub: user.id,
        role: user.role.name,
        permissions: user.role.permissions,
        orgId: user.organization.id,
      }),
    };
  }
}
