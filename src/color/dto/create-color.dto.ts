// src/color/dto/create-color.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateColorDto {
  @ApiProperty({ example: "Qizil", description: "Rang nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "#FF0000", description: "Rangning HEX kodi" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: "HEX kodi noto‘g‘ri formatda (masalan, #FFF yoki #FF0000)",
  })
  hex: string;
}
