// src/product-image/dto/create-product-image.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    example: 1,
    description: 'id of the product this image belongs to',
  })
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({
    example: true,
    description: 'is this the main image for the product?',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_main?: boolean = false;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'product image files (jpg, jpeg, png, gif)',
    required: true, // assuming at least one image is required for creation
  })
  images: any[]; // this will be handled by filesinterceptor, swagger uses 'any' for binary
}
