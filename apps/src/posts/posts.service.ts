import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-response.dto';
import { Posts } from '@/posts/entities/posts.entity';
import { CreatePostDto } from '@/posts/dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly em: EntityManager) {}

  /** Returns all posts. */
  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Posts>> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [data, total] = await this.em.findAndCount(
      Posts,
      {},
      { offset: skip, limit, orderBy: { createdAt: 'desc' } },
    );

    return new PaginationResponseDto(data, total, page, limit);
  }

  /** Returns a single user by id, or throws 404. */
  async findById(id: string): Promise<Posts> {
    const post = await this.em.findOne(Posts, { id });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  /** Retrieves posts by user id. */
  async findByUserId({
    paginationQuery,
    userId,
  }: {
    paginationQuery: PaginationQueryDto;
    userId: string;
  }): Promise<PaginationResponseDto<Posts>> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [data, total] = await this.em.findAndCount(
      Posts,
      { user: userId },
      { offset: skip, limit, orderBy: { createdAt: 'desc' } },
    );

    return new PaginationResponseDto(data, total, page, limit);
  }

  /** Creates and persists a new post from the given DTO. */
  async create(dto: CreatePostDto): Promise<Posts> {
    const post = new Posts();
    Object.assign(post, dto);
    this.em.persist(post);
    await this.em.flush();

    return post;
  }
}
