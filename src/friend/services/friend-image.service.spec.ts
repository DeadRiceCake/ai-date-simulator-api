import { Test, TestingModule } from '@nestjs/testing';

import { AiService } from '../../ai/services/ai.service';
import { ROLE } from '../../auth/constants/role.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { FriendImageOutput } from '../dtos/friend-image-output.dto';
import { GenerateFriendImageInput } from '../dtos/generate-friend-image-input.dto';
import { FriendImage } from '../entities/friend-image.entity';
import { FriendImageRepository } from '../repositories/friend-image.repository';
import { FriendImageService } from './friend-image.service';

describe('FriendImageService', () => {
  let service: FriendImageService;
  let mockedRepository: any;
  let mockedUserService: any;
  let mockedAiService: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendImageService,
        {
          provide: FriendImageRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        { provide: AiService, useValue: { createImage: jest.fn() } },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = module.get<FriendImageService>(FriendImageService);
    mockedRepository = module.get(FriendImageRepository);
    mockedUserService = module.get(UserService);
    mockedAiService = module.get(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('generateFriendImage', () => {
    ctx.user = {
      id: 1,
      roles: [ROLE.USER],
      username: 'testuser',
    };

    it('should get user from user claims user id', () => {
      service.generateFriendImage(ctx, new GenerateFriendImageInput());
      expect(mockedUserService.getUserById).toHaveBeenCalledWith(ctx, ctx.user?.id);
    });

    const input = new GenerateFriendImageInput();
    input.prompt = 'prompt';

    const expectedGeneratedFriendImage = 'https://image.com';
    
    it('should call aiService.createImage with correct input', async () => {
      jest.spyOn(mockedAiService, 'createImage').mockResolvedValue(expectedGeneratedFriendImage);

      await service.generateFriendImage(ctx, input);
      expect(mockedAiService.createImage).toHaveBeenCalledWith(ctx, input.prompt);
    });

    it('should call repository.save with correct input and return the correct result', async () => {
      const friendImage = {
        prompt: 'prompt',
        imageURL: expectedGeneratedFriendImage,
      };

      const currentDate = new Date();

      const expectedSavedFriendImage: FriendImage = {
        id: 1,
        prompt: 'prompt',
        imageURL: expectedGeneratedFriendImage,
        user: new User(),
        createdAt: currentDate,
      };

      mockedRepository.save.mockResolvedValue(expectedSavedFriendImage);

      const result = await mockedRepository.save(friendImage);

      expect(mockedRepository.save).toHaveBeenCalledWith(friendImage);
      expect(result).toEqual(expectedSavedFriendImage);

      const expectedOutput: FriendImageOutput = {
        id: 1,
        prompt: 'prompt',
        imageURL: expectedGeneratedFriendImage,
        createdAt: currentDate,
      };

      expect(await service.generateFriendImage(ctx, input)).toEqual(expectedOutput);
    });
  });
});
