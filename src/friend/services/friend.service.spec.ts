import { Test, TestingModule } from '@nestjs/testing';

import { ROLE } from '../../auth/constants/role.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { UserService } from '../../user/services/user.service';
import { CreateFriendInput } from '../dtos/create-friend-input.dto';
import { FriendRepository } from '../repositories/friend.repository';
import { FriendService } from './friend.service';

describe('FriendService', () => {
  let service: FriendService;
  let mockedRepository: any;
  let mockedUserService: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendService,
        {
          provide: FriendRepository,
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
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = module.get<FriendService>(FriendService);
    mockedRepository = module.get(FriendRepository);
    mockedUserService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create friend', () => {
    it('should get user from user claims user id', () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };

      service.createFriend(ctx, new CreateFriendInput());
      expect(mockedUserService.getUserById).toHaveBeenCalledWith(ctx, ctx.user.id);
    });

    it('should call repository.save with correct input and return the correct result', async () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };

      const friendInput: CreateFriendInput = {
        gender: 'female',
        name: 'John cena',
      };

      const user = new UserOutput();
      mockedUserService.getUserById.mockResolvedValue(user);

      const friend = {
        gender: 'female',
        name: 'John cena',
        imageURL: 'https://item.kakaocdn.net/do/c67b938842b39df1905425bb74c063307154249a3890514a43687a85e6b6cc82',
        user,
      };

      const currentDate = new Date();

      const expectedSavedFriendOutput = {
        id: 1,
        name: 'John cena',
        gender: 'female',
        imageURL: 'https://item.kakaocdn.net/do/c67b938842b39df1905425bb74c063307154249a3890514a43687a85e6b6cc82',
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedRepository.save.mockResolvedValue(expectedSavedFriendOutput);

      const expectedOutput = {
        id: 1,
        name: 'John cena',
        gender: 'female',
        imageURL: 'https://item.kakaocdn.net/do/c67b938842b39df1905425bb74c063307154249a3890514a43687a85e6b6cc82',
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      const output = await service.createFriend(ctx, friendInput);
      console.log(output);
      expect(mockedRepository.save).toHaveBeenCalledWith(friend);
      expect(output).toEqual(expectedOutput);
    });
  });
});
