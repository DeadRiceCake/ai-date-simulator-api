import { Test, TestingModule } from '@nestjs/testing';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateFriendInput } from '../dtos/create-friend-input.dto';
import { FriendOutput } from '../dtos/friend-output.dto';
import { FriendService } from '../services/friend.service';
import { FriendController } from './friend.controller';

describe('FriendController', () => {
  let controller: FriendController;
  const mockedFriendService = {
    createFriend: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendController],
      providers: [
        { provide: FriendService, useValue: mockedFriendService },
        { provide: AppLogger, useValue: mockedLogger },
      ]
    }).compile();

    controller = module.get<FriendController>(FriendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create friend', () => {
    let input: CreateFriendInput;

    beforeEach(() => {
      input = {
        gender: 'female',
        name: 'john cena',
      };
    });

    it('should call friendService.createFriend with correct input', () => {
      controller.createFriend(ctx, input);
      expect(mockedFriendService.createFriend).toHaveBeenCalledWith(ctx, input);
    });

    it('should return the correct result', async () => {
      const currentDate = new Date();
      const expectedOutput: FriendOutput = {
        id: 1,
        name: 'john cena',
        gender: 'female',
        imageURL: 'https://example.com/image.jpg',
        createdAt: currentDate,
        updatedAt: currentDate,
      }

      mockedFriendService.createFriend.mockResolvedValue(expectedOutput);

      expect(await controller.createFriend(ctx, input)).toEqual({
        data: expectedOutput,
        meta: {},
      });
    });
    
    it('should throw error when friendService.createFriend throws an error', async () => {
      mockedFriendService.createFriend.mockRejectedValue({ message: 'Error' });

      try {
        await controller.createFriend(ctx, input);
      } catch (error: any) {
        expect(error.message).toEqual('Error');
      }
    });
  });
});
