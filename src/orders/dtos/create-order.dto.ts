import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';

export class CreateOrderDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  clientId: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
