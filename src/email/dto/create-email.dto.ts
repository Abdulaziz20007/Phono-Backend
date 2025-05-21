import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsInt } from "class-validator";

export class CreateEmailDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Foydalanuvchi elektron pochta manzili",
  })
  @IsEmail({}, { message: "Elektron pochta manzili yaroqli formatda bo'lishi kerak." })
  @IsNotEmpty({ message: "Elektron pochta manzili bo'sh bo'lmasligi kerak." })
  email: string;

  @ApiProperty({ example: 1, description: "Foydalanuvchi IDsi" })
  @IsInt({ message: "user_id butun son bo'lishi kerak." })
  @IsNotEmpty({ message: "user_id bo'sh bo'lmasligi kerak." })
  user_id: number;
}