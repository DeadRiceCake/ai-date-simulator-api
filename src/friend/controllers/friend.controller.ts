import { Body, ClassSerializerInterceptor, Controller, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BaseApiErrorResponse, BaseApiResponse, SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateFriendInput } from '../dtos/create-friend-input.dto';
import { FriendOutput } from '../dtos/friend-output.dto';
import { FriendService } from '../services/friend.service';

@Controller('friends')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FriendController.name);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('')
  @ApiOperation({
    summary: 'Create friend API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(FriendOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async createFriend(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateFriendInput,
  ): Promise<BaseApiResponse<FriendOutput>> {
    this.logger.log(ctx, `${this.createFriend.name} was called`);

    const friend = await this.friendService.createFriend(ctx, input);
    return { data: friend, meta: {} };
  }
}
