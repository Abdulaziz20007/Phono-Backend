import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsString } from 'class-validator';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    example: 1,
    description: 'Currency ID for user preferences',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  currency_id?: number;

  @ApiProperty({
    example: true,
    description: 'User active status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdatePasswordDto {
  @ApiProperty({
    example: '123456789',
    description: 'User current password',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: '987654321',
    description: 'User new password',
    required: true,
  })
  @IsString()
  new_password: string;
}
