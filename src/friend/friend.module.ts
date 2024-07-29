import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { FriendController } from './controllers/friend.controller';
import { Friend } from './entities/friend.entity';
import { FriendRepository } from './repositories/friend.repository';
import { FriendService } from './services/friend.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Friend]), UserModule],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository],
})
export class FriendModule {}
