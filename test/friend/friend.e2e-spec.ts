import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { AuthTokenOutput } from '../../src/auth/dtos/auth-token-output.dto';
import { CreateFriendInput } from '../../src/friend/dtos/create-friend-input.dto';
import {
  closeDBAfterTest,
  createDBEntities,
  resetDBBeforeTest,
  seedAdminUser,
} from '../test-utils';

describe('FriendController (e2e)', () => {
  let app: INestApplication;
  let authTokenForAdmin: AuthTokenOutput;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    ({ authTokenForAdmin } = await seedAdminUser(app));
  });

  describe('Create a friend', () => {
    it('Create friend successfully', async () => {
      const friendInput: CreateFriendInput = {
        name: 'booker T',
        gender: 'female',
      };

      const friendOutput = {
        id: 1,
        name: 'booker T',
        gender: 'female',
        imageURL: 'https://item.kakaocdn.net/do/c67b938842b39df1905425bb74c063307154249a3890514a43687a85e6b6cc82',
      };
      
      return request(app.getHttpServer())
        .post('/friends')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .send(friendInput)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const { data } = res.body;
          expect(data).toEqual(expect.objectContaining(friendOutput));
        });
    });

    it('Bad request error when put wrong gender', async () => {
      const friendInput = {
        name: 'booker T',
        gender: 'transgender',
      };
      
      return request(app.getHttpServer())
        .post('/friends')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .send(friendInput)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
