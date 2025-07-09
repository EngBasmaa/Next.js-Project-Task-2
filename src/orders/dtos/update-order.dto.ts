import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';

export class UpdateOrderDto {
  @ApiProperty({ example: 1230 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: 1230 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 1230 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 1230 })
  @IsOptional()
  @IsNumber()
  clientId?: number;

  @ApiProperty({ example: PaymentMethod.CASH })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}
