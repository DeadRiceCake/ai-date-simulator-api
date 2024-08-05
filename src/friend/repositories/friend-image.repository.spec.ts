import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { FriendImage } from '../entities/friend-image.entity';
import { FriendImageRepository } from './friend-image.repository';

describe('FriendImageRepository', () => {
  let repository: FriendImageRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FriendImageRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<FriendImageRepository>(FriendImageRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get by user id', () => {
    const currentDate = new Date();

    it('should call find with correct user id', () => {
      const userId = 1;

      jest.spyOn(repository, 'find').mockResolvedValue([new FriendImage()]);
      repository.getByUserId(userId);
      expect(repository.find).toHaveBeenCalledWith({ where: { user: { id: userId } } });
    });

    it('should return the correct result if found', async () => {
      const userId = 1;
      const expectedOutput: FriendImage[] = [
        {
          id: 1,
          prompt: 'Prompt 1',
          imageURL: 'http://example.com/image.jpg',
          user: new User(),
          createdAt: currentDate,
        }
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedOutput);
      const result = await repository.getByUserId(userId);
      expect(result).toEqual(expectedOutput);
    });
  });
});
