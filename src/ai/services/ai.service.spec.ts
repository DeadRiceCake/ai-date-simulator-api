import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AiService } from './ai.service';

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      images: {
        generate: jest.fn().mockImplementation(async() => {
          return {
            created: 1589478378,
            data: [
              {
                url: 'https://openai.com/image.jpg',
              },
            ]
          };
        }),
      },
    };
  });
});

describe('AiService', () => {
  let service: AiService;

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: { get: jest.fn(() => {return 'any value'}) } },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('createImage', () => {
    it('should return ImageResponse', async () => {
      const prompt = 'draw a kawaii girl';
      
      const imageResponse = await service.createImage(ctx, prompt);

      expect(imageResponse).toEqual('https://openai.com/image.jpg');
    });
  });
});
