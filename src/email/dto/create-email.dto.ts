import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchi elektron pochta manzili',
  })
  @IsEmail(
    {},
    { message: "Elektron pochta manzili yaroqli formatda bo'lishi kerak." },
  )
  @IsNotEmpty({ message: "Elektron pochta manzili bo'sh bo'lmasligi kerak." })
  email: string;

  @ApiProperty({ example: 1, description: 'Foydalanuvchi IDsi' })
  @IsInt({ message: "user_id butun son bo'lishi kerak." })
  @IsOptional()
  user_id?: number;
}
