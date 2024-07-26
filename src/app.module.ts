import { Module } from '@nestjs/common';

import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { FriendModule } from './friend/friend.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SharedModule, UserModule, AuthModule, ArticleModule, AiModule, FriendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
