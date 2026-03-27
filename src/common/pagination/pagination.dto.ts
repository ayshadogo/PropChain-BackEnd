import { IsInt, IsOptional, Min, Max, IsString, IsIn, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Query parameters for pagination
 */
@Exclude()
export class PaginationQueryDto {
  @Expose()
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Expose()
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @Expose()
  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @Expose()
  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(partial: Partial<PaginationQueryDto>) {
    Object.assign(this, partial);
  }
}

/**
 * Pagination metadata included in list responses
 */
@Exclude()
export class PaginationMetadataDto {
  @Expose()
  @ApiProperty({ example: 100, description: 'Total number of items' })
  @IsInt()
  @Min(0)
  total: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Current page number' })
  @IsInt()
  @Min(1)
  page: number;

  @Expose()
  @ApiProperty({ example: 10, description: 'Items per page' })
  @IsInt()
  @Min(1)
  limit: number;

  @Expose()
  @ApiProperty({ example: 10, description: 'Total number of pages' })
  @IsInt()
  @Min(0)
  pages: number;

  @Expose()
  @ApiProperty({ example: true, description: 'Whether there is a next page' })
  @IsBoolean()
  hasNext: boolean;

  @Expose()
  @ApiProperty({ example: false, description: 'Whether there is a previous page' })
  @IsBoolean()
  hasPrev: boolean;

  @Expose()
  @ApiProperty({ example: 'createdAt', description: 'Field sorted by' })
  @IsString()
  sortBy: string;

  @Expose()
  @ApiProperty({ example: 'desc', description: 'Sort order direction' })
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc';

  constructor(partial: Partial<PaginationMetadataDto>) {
    Object.assign(this, partial);
  }
}

/**
 * Generic paginated response wrapper
 */
@Exclude()
export class PaginatedResponseDto<T> {
  @Expose()
  @ApiProperty({ isArray: true, description: 'Array of data items' })
  @IsArray()
  data: T[];

  @Expose()
  @ApiProperty({ type: PaginationMetadataDto, description: 'Pagination metadata' })
  @ValidateNested()
  @Type(() => PaginationMetadataDto)
  meta: PaginationMetadataDto;

  constructor(partial: Partial<PaginatedResponseDto<T>>) {
    Object.assign(this, partial);
  }

  /**
   * Factory method to create paginated response from data and metadata
   */
  static create<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): PaginatedResponseDto<T> {
    const pages = Math.ceil(total / limit);
    return new PaginatedResponseDto({
      data,
      meta: new PaginationMetadataDto({
        total,
        page,
        limit,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
        sortBy,
        sortOrder,
      }),
    });
  }
}
