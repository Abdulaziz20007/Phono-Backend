import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePaymentMethodDto {
  @ApiProperty({ example: "Card", description: "Payment method" })
  @IsString()
  @IsNotEmpty()
  name: string;
}
