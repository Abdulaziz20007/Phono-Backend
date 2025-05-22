import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Uy', description: 'Manzil nomi (masalan, Uy, Ish)' })
  @IsString({ message: "Manzil nomi matn bo'lishi kerak." })
  @IsNotEmpty({ message: "Manzil nomi bo'sh bo'lmasligi kerak." })
  name: string;

  @ApiProperty({
    example: "Toshkent sh., Amir Temur ko'chasi, 1-uy",
    description: "To'liq manzil",
  })
  @IsString({ message: "Manzil matn bo'lishi kerak." })
  @IsNotEmpty({ message: "Manzil bo'sh bo'lmasligi kerak." })
  address: string;

  @ApiProperty({ example: '41.2995', description: 'Kenglik (Latitude)' })
  @IsString({ message: "Kenglik matn bo'lishi kerak." })
  @IsNotEmpty({ message: "Kenglik bo'sh bo'lmasligi kerak." })
  @Matches(/^-?([1-8]?[0-9]|[1-9]0)\.{1}\d{1,15}$/, {
    message: "Kenglik yaroqli formatda bo'lishi kerak.",
  })
  lat: string;

  @ApiProperty({ example: '69.2401', description: 'Uzunlik (Longitude)' })
  @IsString({ message: "Uzunlik matn bo'lishi kerak." })
  @IsNotEmpty({ message: "Uzunlik bo'sh bo'lmasligi kerak." })
  @Matches(/^-?((1[0-7]|[1-9])?\d|180)\.{1}\d{1,15}$/, {
    message: "Uzunlik yaroqli formatda bo'lishi kerak.",
  })
  long: string;

  @ApiProperty({ example: 1, description: 'Foydalanuvchi IDsi' })
  @IsInt({ message: "user_id butun son bo'lishi kerak." })
  @IsOptional()
  user_id?: number;

  @ApiProperty({
    example: true,
    description: 'Manzil aktivmi?',
    required: false,
    default: true,
  })
  @IsBoolean({ message: "is_active boolean qiymat bo'lishi kerak." })
  @IsOptional() // Buni default qiymat bilan ishlatish uchun service da qo'shimcha logika kerak bo'lishi mumkin
  is_active?: boolean; // Agar jo'natilmasa, default qiymat true deb olinadi (service da)
}
