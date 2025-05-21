import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockDto {
  @ApiProperty({ description: 'ID of the user to be blocked' })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'ID of the admin who is blocking the user' })
  @IsNotEmpty()
  @IsNumber()
  admin_id: number;

  @ApiProperty({ description: 'Reason for blocking the user' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Expiration date of the block', required: false })
  @IsOptional()
  @IsDateString()
  expire_date: Date;
}
