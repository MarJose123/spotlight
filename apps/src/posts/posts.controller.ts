import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PostsService } from '@/posts/posts.service';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { CreatePostDto } from '@/posts/dto/create-post.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Posts } from '@/posts/entities/posts.entity';
import { PaginationResponseDto } from '@/common/dto/pagination-response.dto';
import { LikePostDto } from '@/posts/dto/like-post.dto';

@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Get all post',
    description: 'Get all post',
  })
  @ApiOkResponse({
    description: 'success',
    type: PaginationResponseDto<Posts>,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@Query() paginationQuery: PaginationQueryDto) {
    return this.postsService.findAll(paginationQuery);
  }

  @ApiOperation({
    summary: 'Get post by user id',
    description: 'Get post by user id',
  })
  @ApiOkResponse({
    description: 'success',
    type: PaginationResponseDto<Posts>,
  })
  @Get('/user/:id')
  @UseGuards(JwtAuthGuard)
  async getPostsByUser(
    @Query() paginationQuery: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.postsService.findByUserId({ paginationQuery, userId: id });
  }

  @ApiOperation({
    summary: 'Create post',
    description: 'Create post'
  })
  @ApiOkResponse({
    description: 'success',
    type: Posts,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }


  @ApiOperation({
    summary: 'Like post',
    description: 'Like post'
  })
  @ApiOkResponse({
    description: 'success',
    type: Posts,
  })
  @Post('/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Body() dto: LikePostDto) {
    return this.postsService.likePost(dto);
  }
}
