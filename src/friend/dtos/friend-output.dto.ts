import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Gender } from '../constants/gender.constant';

export class FriendOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  gender: Gender;

  @Expose()
  @ApiProperty()
  imageURL: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date; 
}
