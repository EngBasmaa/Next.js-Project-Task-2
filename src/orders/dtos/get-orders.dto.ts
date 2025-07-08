// dto/get-orders.dto.ts
import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';

export class GetOrdersDto {
    @IsOptional()
    @IsNumberString()
    clientId?: string;

    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod?: PaymentMethod;
}
