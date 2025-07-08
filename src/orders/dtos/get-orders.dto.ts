// dto/get-orders.dto.ts
import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrdersDto {
    @ApiProperty({ example: 1230 })
    @IsOptional()
    @IsNumberString()
    clientId?: string;

    @ApiProperty({ example: PaymentMethod.CASH })
    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod?: PaymentMethod;
}
