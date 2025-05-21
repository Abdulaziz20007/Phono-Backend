// src/product-image/dto/create-product-image.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the product this image belongs to',
  })
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({
    example: true,
    description: 'Is this the main image for the product?',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_main?: boolean = false;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product image file (jpg, jpeg, png, gif)',
    required: true, // Assuming an image is always required for creation
  })
  image: any; // This will be handled by FileInterceptor, Swagger uses 'any' for binary
}
