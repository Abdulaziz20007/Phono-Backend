import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCurrencyDto {
  @ApiProperty({ example: "US Dollar", description: "Valyuta nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "$", description: "Valyuta belgisi" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  symbol: string;
}
