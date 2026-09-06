import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationMetaDto {
  @ApiProperty()
  @IsNumber()
  total!: number;

  @ApiProperty()
  @IsNumber()
  itemCount!: number;

  @ApiProperty()
  @IsNumber()
  perPage!: number;

  @ApiProperty()
  @IsNumber()
  totalPages!: number;

  @ApiProperty()
  @IsNumber()
  currentPage!: number;

  @ApiProperty()
  hasNextPage!: boolean;

  @ApiProperty()
  hasPreviousPage!: boolean;
}
