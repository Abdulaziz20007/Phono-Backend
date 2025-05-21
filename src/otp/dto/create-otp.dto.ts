import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsNotEmpty } from 'class-validator';

export class CreateOtpDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user this OTP belongs to',
  })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    example: '123456',
    description: 'One-time password code',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'Expiration date of the OTP',
  })
  @IsDate()
  @IsNotEmpty()
  expire: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the OTP',
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
