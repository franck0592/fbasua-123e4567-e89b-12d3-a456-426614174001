import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '@task-management/data';
import { Repository } from 'typeorm';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  /**
   * Get all org IDs the user can see (their org + sub-orgs)
   */
  async getAccessibleOrgIds(orgId: number): Promise<number[]> {
    const orgs = await this.orgRepo.find({
      relations: ['children', 'parent'],
    });

    const ids = new Set<number>();

    const traverse = (id: number) => {
      ids.add(id);
      orgs
        .filter((o) => o.parent?.id === id)
        .forEach((child) => traverse(child.id));
    };

    traverse(orgId);

    return [...ids];
  }
}
