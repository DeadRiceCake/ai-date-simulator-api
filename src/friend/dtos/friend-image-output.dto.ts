import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FriendImageOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  prompt: string;

  @Expose()
  @ApiProperty()
  imageURL: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
