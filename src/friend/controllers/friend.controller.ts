import { Body, ClassSerializerInterceptor, Controller, Get, HttpStatus, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BaseApiErrorResponse, BaseApiResponse, SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateFriendInput } from '../dtos/create-friend-input.dto';
import { FriendImageOutput } from '../dtos/friend-image-output.dto';
import { FriendOutput } from '../dtos/friend-output.dto';
import { GenerateFriendImageInput } from '../dtos/generate-friend-image-input.dto';
import { FriendService } from '../services/friend.service';
import { FriendImageService } from '../services/friend-image.service';

@Controller('friends')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly friendImageService: FriendImageService,
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
    status: HttpStatus.CREATED,
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/images')
  @ApiOperation({
    summary: 'Generate friend image API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(FriendOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async generateFriendImage(
    @ReqContext() ctx: RequestContext,
    @Body() input: GenerateFriendImageInput,
  ): Promise<BaseApiResponse<FriendImageOutput>> {
    this.logger.log(ctx, `${this.generateFriendImage.name} was called`);

    const friendImgae = await this.friendImageService.generateFriendImage(ctx, input);
    return { data: friendImgae, meta: {} };
  }

  @Get('/images')
  @ApiOperation({
    summary: 'Get friend Images as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([FriendImageOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getArticles(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<FriendImageOutput[]>> {
    this.logger.log(ctx, `${this.getArticles.name} was called`);

    const { friendImages, count } = await this.friendImageService.getFriendImages(
      ctx,
      query.limit,
      query.offset,
    );

    return { data: friendImages, meta: { count } };
  }
}
