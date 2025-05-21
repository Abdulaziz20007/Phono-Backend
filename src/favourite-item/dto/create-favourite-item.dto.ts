// src/favourite-item/dto/create-favourite-item.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt } from "class-validator";

export class CreateFavouriteItemDto {
  @ApiProperty({
    example: 1,
    description: "Sevimlilarga qo'shiladigan mahsulotning IDsi",
    required: true,
  })
  @IsInt({ message: "Mahsulot IDsi butun son bo'lishi kerak." })
  @IsNotEmpty({ message: "Mahsulot IDsi bo'sh bo'lmasligi kerak." })
  product_id: number;

  @ApiProperty({ // user_id uchun ApiProperty qo'shildi
    example: 1,
    description: "Foydalanuvchi IDsi",
    required: true,
  })
  @IsInt({ message: "Foydalanuvchi IDsi butun son bo'lishi kerak." })
  @IsNotEmpty({ message: "Foydalanuvchi IDsi bo'sh bo'lmasligi kerak." })
  user_id: number;
}