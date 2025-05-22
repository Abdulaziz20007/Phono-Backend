// src/admin/dto/create-admin.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsPhoneNumber,
  MinLength,
  IsOptional,
  IsBoolean,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Parollarni solishtirish uchun custom validator
@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (password !== (args.object as CreateAdminDto)[args.constraints[0]]) {
      // args.constraints[0] bu 'password' maydoni
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Parollar mos kelmadi.';
  }
}

export class CreateAdminDto {
  @ApiProperty({ example: 'John', description: 'Admin ismi' })
  @IsString()
  @IsNotEmpty()
  name: string; // Avvalgi DTO da bor edi, Prisma modelida ham

  @ApiProperty({ example: 'Doe', description: 'Admin familiyasi' })
  @IsString()
  @IsNotEmpty()
  surname: string; // Avvalgi DTO da bor edi, Prisma modelida ham

  @ApiProperty({
    example: '1990-01-15',
    description: "Admin tug'ilgan sanasi (YYYY-MM-DD)",
  })
  @IsDateString()
  @IsNotEmpty()
  birth_date: string;

  @ApiProperty({
    example: '901234567',
    description: 'Admin telefon raqami',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'Admin paroli' })
  @IsString()
  @MinLength(8, { message: "Parol kamida 8 belgidan iborat bo'lishi kerak" })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'Parolni tasdiqlang' })
  @IsString()
  @MinLength(8, {
    message: "Tasdiqlash paroli kamida 8 belgidan iborat bo'lishi kerak",
  })
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'], {
    // 'password' maydoni bilan solishtiradi
    message: 'Parollar mos kelmadi.',
  })
  confirm_password: string; // AdminService.create da ishlatilgan

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Admin avatar rasmi (fayl sifatida yuklang)',
    required: false,
  })
  @IsOptional()
  avatar?: any;
}
