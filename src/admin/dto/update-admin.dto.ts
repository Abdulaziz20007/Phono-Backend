// src/admin/dto/update-admin.dto.ts
import { PartialType } from "@nestjs/swagger";
import { CreateAdminDto } from "./create-admin.dto";
import { IsOptional, IsString, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiPropertyOptional({
    example: "NewSecureP@ss123",
    description: "Yangi parol (o'zgartirish uchun)",
  })
  @IsString()
  @MinLength(8, {
    message: "Yangi parol kamida 8 belgidan iborat bo'lishi kerak",
  })
  @IsOptional()
  new_password?: string; // Parolni alohida maydon qilib olish yaxshiroq

  // password maydonini PartialType dan olib tashlash uchun (agar CreateAdminDto dan kelsa)
  // CreateAdminDto da password majburiy, bu yerda ixtiyoriy (faqat yangi parol berilsa o'zgaradi)
  password?: never;
}
