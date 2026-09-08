import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({
  path: 'users',
  version: '1',
})
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query()
    pagination: PaginationQueryDto,
  ): Promise<PaginationResponseDto<User>> {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<User> {
    return this.usersService.remove(id);
  }
}
