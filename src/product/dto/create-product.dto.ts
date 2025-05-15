import { IsString, IsInt, IsBoolean, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  user_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  year: number;

  @IsInt()
  brand_id: number;

  @IsInt()
  model_id: number;

  @IsString()
  custom_model: string;

  @IsInt()
  color_id: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  floor_price: boolean;

  @IsInt()
  currency_id: number;

  @IsBoolean()
  is_new: boolean;

  @IsBoolean()
  has_document: boolean;

  @IsInt()
  address_id: number;

  @IsInt()
  phone_id: number;

  @IsInt()
  storage: number;

  @IsInt()
  ram: number;
}
