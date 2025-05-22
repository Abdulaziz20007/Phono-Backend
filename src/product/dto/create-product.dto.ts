import {
  IsString,
  IsInt,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'User ID who owns the product' })
  @IsInt()
  @IsNotEmpty()
  user_id?: number;

  @ApiProperty({ example: 'iPhone 13 Pro Max', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Excellent condition, barely used',
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2023, description: 'Product year' })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  @IsInt()
  @IsNotEmpty()
  brand_id: number;

  @ApiProperty({ example: 1, description: 'Model ID' })
  @IsInt()
  @IsNotEmpty()
  model_id: number;

  @ApiProperty({
    example: 'Custom Model Name',
    description: 'Custom model name if not in standard models',
  })
  @IsString()
  @IsNotEmpty()
  custom_model?: string;

  @ApiProperty({ example: 1, description: 'Color ID' })
  @IsInt()
  @IsNotEmpty()
  color_id: number;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: false, description: 'Whether price is negotiable' })
  @IsBoolean()
  floor_price: boolean;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  @IsInt()
  @IsNotEmpty()
  currency_id: number;

  @ApiProperty({ example: true, description: 'Whether product is new' })
  @IsBoolean()
  is_new: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether product has documentation',
  })
  @IsBoolean()
  has_document: boolean;

  @ApiProperty({ example: 1, description: 'Address ID' })
  @IsInt()
  @IsNotEmpty()
  address_id: number;

  @ApiProperty({ example: 1, description: 'Phone ID for contact' })
  @IsInt()
  @IsNotEmpty()
  phone_id: number;

  @ApiProperty({ example: 256, description: 'Storage capacity in GB' })
  @IsInt()
  @IsNotEmpty()
  storage: number;

  @ApiProperty({ example: 8, description: 'RAM capacity in GB' })
  @IsInt()
  @IsNotEmpty()
  ram: number;
}
