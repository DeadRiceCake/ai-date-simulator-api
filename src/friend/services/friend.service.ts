import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { CreateFriendInput } from '../dtos/create-friend-input.dto';
import { FriendOutput } from '../dtos/friend-output.dto';
import { Friend } from '../entities/friend.entity';
import { FriendRepository } from '../repositories/friend.repository';

@Injectable()
export class FriendService {
  constructor(
    private repository: FriendRepository,
    private userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FriendService.name);
  }

  async createFriend(ctx: RequestContext, input: CreateFriendInput): Promise<FriendOutput> {
    this.logger.log(ctx, `${this.createFriend.name} was called`);

    const friend = plainToClass(Friend, input);

    const user = await this.userService.getUserById(ctx, ctx.user!.id);

    friend.user = plainToClass(User, user);

    // put a default image URL
    friend.imageURL = 'https://item.kakaocdn.net/do/c67b938842b39df1905425bb74c063307154249a3890514a43687a85e6b6cc82'

    this.logger.log(ctx, `calling ${FriendRepository.name}.saveFriend`);
    const savedFriend = await this.repository.save(friend);

    return plainToClass(FriendOutput, savedFriend, {
      excludeExtraneousValues: true,
    });
  }
}
