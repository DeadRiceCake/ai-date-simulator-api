import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { FriendRepository } from './friend.repository';

describe('FriendRepository', () => {
  let repository: FriendRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<FriendRepository>(FriendRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
