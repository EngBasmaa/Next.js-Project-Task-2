import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1230 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 1230 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 1230 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 1230 })
  @IsNumber()
  clientId: number;

  @ApiProperty({ example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
