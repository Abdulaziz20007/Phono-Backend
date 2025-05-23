// src/favourite-item/dto/create-favourite-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateFavouriteItemDto {
  @ApiProperty({
    example: 1,
    description: "Sevimlilarga qo'shiladigan mahsulotning IDsi",
    required: true,
  })
  @IsInt({ message: "Mahsulot IDsi butun son bo'lishi kerak." })
  @IsNotEmpty({ message: "Mahsulot IDsi bo'sh bo'lmasligi kerak." })
  product_id: number;

  @ApiProperty({
    example: 1,
    description:
      "Foydalanuvchi IDsi (ADMIN uchun, agar boshqa foydalanuvchi uchun sevimlilarga qo'shilayotgan bo'lsa). Oddiy foydalanuvchi tomonidan yuborilmasligi kerak yoki e'tiborga olinmaydi.",
    required: false,
  })
  @IsInt({ message: "Foydalanuvchi IDsi butun son bo'lishi kerak." })
  @IsOptional()
  user_id?: number;
}
