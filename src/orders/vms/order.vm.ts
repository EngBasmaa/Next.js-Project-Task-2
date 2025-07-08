import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../enums/payment-method.enum';

export class OrderVM {
    @ApiProperty({ example: 1230 })
    id: string;
    @ApiProperty({ example: 1230 })
    amount: number;
    @ApiProperty({ example: 1230 })
    longitude: number;
    @ApiProperty({ example: 1230 })
    latitude: number;
    @ApiProperty({ example: 1230 })
    clientId: number;
    @ApiProperty({ example: PaymentMethod.CASH })
    paymentMethod: PaymentMethod;

    constructor(order: any) {
        this.id = order.id;
        this.amount = order.amount;
        this.longitude = order.longitude;
        this.latitude = order.latitude;
        this.clientId = order.clientId;
        this.paymentMethod = order.paymentMethod;
    }
}
