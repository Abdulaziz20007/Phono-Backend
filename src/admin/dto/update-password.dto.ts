// update-password.dto.ts faylini yaratamiz
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({
    example: "OldPassword123!",
    description: "Eski parol",
  })
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiProperty({
    example: "NewStrongPassword123!",
    description: "Yangi parol",
  })
  @IsStrongPassword()
  @IsNotEmpty()
  readonly newPassword: string;

  @ApiProperty({
    example: "NewStrongPassword123!",
    description: "Yangi parolni tasdiqlash",
  })
  @IsString()
  @IsNotEmpty()
  readonly confirmNewPassword: string;
}
