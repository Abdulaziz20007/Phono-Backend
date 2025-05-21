import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInAdminDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Admin phone number',
  })
  @IsEmail()
  readonly phone: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Admin password',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
