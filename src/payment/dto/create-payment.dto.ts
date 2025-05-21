import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ type: Number, example: 1 })
  @Type(() => Number)
  @IsInt()
  user_id: number;

  @ApiProperty({
    type: Number,
    format: 'float',
    example: 123.45,
    description: ' float',
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 4 },
    { message: 'Amount should be a number with up to 2 decimal places' },
  )
  amount: number;

  @ApiProperty({ type: Number, example: 2 })
  @Type(() => Number)
  @IsInt()
  payment_method_id: number;
}
