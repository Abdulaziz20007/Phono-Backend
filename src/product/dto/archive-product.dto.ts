import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ArchiveProductDto {
  @IsOptional()
  @IsBoolean()
  is_sold?: boolean;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}
