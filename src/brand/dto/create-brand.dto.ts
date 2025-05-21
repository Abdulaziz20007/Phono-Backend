// src/brand/dto/create-brand.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
  @ApiProperty({ example: "Samsung", description: "Brand nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Brand logotipi (fayl sifatida yuklang)",
    required: false,
  })
  image: any;
}
