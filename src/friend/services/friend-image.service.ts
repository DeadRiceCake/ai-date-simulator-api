import { Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import { AiService } from '../../ai/services/ai.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { FriendImageOutput } from '../dtos/friend-image-output.dto';
import { GenerateFriendImageInput } from '../dtos/generate-friend-image-input.dto';
import { FriendImage } from '../entities/friend-image.entity';
import { FriendImageRepository } from '../repositories/friend-image.repository';

@Injectable()
export class FriendImageService {
  constructor(
    private repository: FriendImageRepository,
    private userService: UserService,
    private aiService: AiService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FriendImageService.name);
  }

  async generateFriendImage(ctx: RequestContext, input: GenerateFriendImageInput): Promise<FriendImageOutput> {
    this.logger.log(ctx, `${this.generateFriendImage.name} was called`);
    
    const user = await this.userService.getUserById(ctx, ctx.user!.id);

    const generatedFriendImage = await this.aiService.createImage(ctx, input.prompt);

    const friendImage = plainToClass(FriendImage, { ...input, imageURL: generatedFriendImage });

    friendImage.user = plainToClass(User, user);

    this.logger.log(ctx, `calling ${FriendImageRepository.name}.saveFriendImage`);
    const savedFriendImage = await this.repository.save(friendImage);

    return plainToClass(FriendImageOutput, savedFriendImage, {
      excludeExtraneousValues: true,
    });
  }

  async getFriendImages(ctx: RequestContext, limit: number, offset: number): Promise<{ friendImages: FriendImageOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getFriendImages.name} was called`);

    const userId = ctx.user!.id;

    const [friendImages, count] = await this.repository.findAndCount({
      where: {
        user: {
          id: userId,
        },
      },
      take: limit,
      skip: offset,
    });

    const friendImagesOutput = plainToInstance(FriendImageOutput, friendImages, {
      excludeExtraneousValues: true,
    });

    return { friendImages: friendImagesOutput, count };
  }
}
