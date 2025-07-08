import { PaymentMethod } from '../enums/payment-method.enum';

export class OrderVM {
    id: string;
    amount: number;
    longitude: number;
    latitude: number;
    clientId: number;
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
