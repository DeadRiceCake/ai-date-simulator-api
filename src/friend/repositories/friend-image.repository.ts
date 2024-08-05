import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FriendImage } from '../entities/friend-image.entity';

@Injectable()
export class FriendImageRepository extends Repository<FriendImage> {
  constructor(private dataSource: DataSource) {
    super(FriendImage, dataSource.createEntityManager());
  }

  async getByUserId(userId: number): Promise<FriendImage[]> {
    const friendImages = await this.find({ 
      where: {
        user: {
          id: userId
        }
      } 
    });

    if (!friendImages) {
      throw new NotFoundException();
    }

    return friendImages;
  }
}
