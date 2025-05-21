// src/product-image/dto/update-product-image.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
// We don't extend CreateProductImageDto directly because product_id shouldn't be updatable here
// and 'image' has a different 'required' status.

export class UpdateProductImageDto {
  @ApiProperty({
    example: true,
    description: 'Update if this is the main image for the product',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_main?: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'New product image file to replace the old one (optional)',
    required: false,
  })
  @IsOptional()
  image?: any; // This will be handled by FileInterceptor
}
