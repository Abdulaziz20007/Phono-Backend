import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi IDsi' })
  @IsInt({ message: "user_id butun son bo'lishi kerak." })
  @IsOptional()
  user_id?: number;

  @ApiProperty({ example: 1, description: 'Mahsulot IDsi' })
  @IsInt({ message: "product_id butun son bo'lishi kerak." })
  @IsNotEmpty({ message: "product_id bo'sh bo'lmasligi kerak." })
  product_id: number;

  @ApiProperty({ example: 'Bu ajoyib mahsulot!', description: 'Izoh matni' })
  @IsString({ message: "Izoh matn bo'lishi kerak." })
  @IsNotEmpty({ message: "Izoh bo'sh bo'lmasligi kerak." })
  @MinLength(3, { message: "Izoh kamida 3 belgidan iborat bo'lishi kerak." })
  text: string;
}
