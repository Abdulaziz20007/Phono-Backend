// src/model/dto/create-model.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt, Min } from "class-validator";

export class CreateModelDto {
  @ApiProperty({ example: "Galaxy S23", description: "Model nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: "Brandning ID raqami" })
  @IsInt()
  @Min(1) // Brand ID musbat butun son bo'lishi kerak
  @IsNotEmpty()
  brand_id: number;
}
