import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({
    description: 'Name of the region',
    example: 'Toshkent',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
