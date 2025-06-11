import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchProductDto {
  @ApiProperty({
    example: 'iphone',
    description: 'Text to search for in product titles',
    required: true,
  })
  @IsString()
  search: string;

  @ApiProperty({
    example: true,
    description: 'Only return top (featured) products',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  top?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Filter by region ID',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  region_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Filter by category ID',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  category_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Filter by brand ID',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brand_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Filter by color ID',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  color_id?: number;

  @ApiProperty({
    example: 500,
    description: 'Minimum price (inclusive)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price_from?: number;

  @ApiProperty({
    example: 1000,
    description: 'Maximum price (inclusive)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price_to?: number;

  @ApiProperty({
    example: 128,
    description: 'Minimum storage capacity in GB (inclusive)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  memory_from?: number;

  @ApiProperty({
    example: 512,
    description: 'Maximum storage capacity in GB (inclusive)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  memory_to?: number;

  @ApiProperty({
    example: 6,
    description: 'Minimum RAM capacity in GB (inclusive)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ram_from?: number;

  @ApiProperty({
    example: 12,
    description: 'Maximum RAM capacity in GB (inclusive)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ram_to?: number;
}
