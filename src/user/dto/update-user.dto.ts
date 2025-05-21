import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsString } from 'class-validator';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  avatar?: string;

  @IsNumber()
  @IsOptional()
  currency_id?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
