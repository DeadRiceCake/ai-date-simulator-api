import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiModule } from '../ai/ai.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { FriendController } from './controllers/friend.controller';
import { Friend } from './entities/friend.entity';
import { FriendRepository } from './repositories/friend.repository';
import { FriendImageRepository } from './repositories/friend-image.repository';
import { FriendService } from './services/friend.service';
import { FriendImageService } from './services/friend-image.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Friend]), UserModule, AiModule],
  controllers: [FriendController],
  providers: [FriendService, FriendRepository, FriendImageService, FriendImageRepository],
})
export class FriendModule {}
