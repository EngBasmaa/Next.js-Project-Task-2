// dto/get-orders.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';

export class GetOrdersDto {
    @ApiProperty({ example: 1230, required: false })
    @IsOptional()
    @IsNumberString()
    clientId?: string;

    @ApiProperty({ example: PaymentMethod.CASH, required: false })
    @IsOptional()
    @IsEnum(PaymentMethod)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (normalized === 'cash') return PaymentMethod.CASH;
            if (normalized === 'visa') return PaymentMethod.VISA;
        }
        return value;
    })
    paymentMethod?: PaymentMethod;
}
