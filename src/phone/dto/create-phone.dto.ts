import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreatePhoneDto {
  @ApiProperty({
    example: '901234567',
    description: 'Foydalanuvchi telefon raqami (xalqaro formatda)',
  })
  @IsString({ message: "Telefon raqami matn ko'rinishida bo'lishi kerak." })
  @IsNotEmpty({ message: "Telefon raqami bo'sh bo'lmasligi kerak." })
  phone: string;

  @ApiProperty({ example: 1, description: 'Foydalanuvchi IDsi' })
  @IsInt({ message: "user_id butun son bo'lishi kerak." })
  @IsOptional()
  user_id?: number;
}
