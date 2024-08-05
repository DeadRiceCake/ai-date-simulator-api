import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class GenerateFriendImageInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
