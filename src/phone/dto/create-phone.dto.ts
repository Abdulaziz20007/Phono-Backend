import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt, Matches } from "class-validator";

export class CreatePhoneDto {
  @ApiProperty({
    example: "+998901234567",
    description: "Foydalanuvchi telefon raqami (xalqaro formatda)",
  })
  @IsString({ message: "Telefon raqami matn ko'rinishida bo'lishi kerak." })
  @IsNotEmpty({ message: "Telefon raqami bo'sh bo'lmasligi kerak." })
  // Oddiy xalqaro format uchun regex, ehtiyojga qarab o'zgartirilishi mumkin
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: "Telefon raqami yaroqli xalqaro formatda bo'lishi kerak (masalan, +998901234567).",
  })
  phone: string;

  @ApiProperty({ example: 1, description: "Foydalanuvchi IDsi" })
  @IsInt({ message: "user_id butun son bo'lishi kerak." })
  @IsNotEmpty({ message: "user_id bo'sh bo'lmasligi kerak." })
  user_id: number;
}