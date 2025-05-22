import { CreateUserDto } from '../../user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class RegisterDto extends CreateUserDto {}

export class LoginDto {
  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OtpDto {
  @ApiProperty({ example: '123456', description: 'One-time password' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier',
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'Expiration date',
  })
  @IsDate()
  expire: Date;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UserJwtDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: true, description: 'User active status' })
  @IsBoolean()
  is_active: boolean;
}

export class AdminJwtDto {
  @ApiProperty({ example: 1, description: 'Admin ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: '+998901234567', description: 'Admin phone number' })
  @IsString()
  phone: string;
}
