import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Friend } from '../entities/friend.entity';

@Injectable()
export class FriendRepository extends Repository<Friend> {
  constructor(private dataSource: DataSource) {
    super(Friend, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Friend> {
    const friend = await this.findOne({ where: { id } });
    if (!friend) {
      throw new NotFoundException();
    }

    return friend;
  }
}
