import { v4 as uuid } from 'uuid';
import { PaymentMethod } from '../enums/payment-method.enum';

export class Order {
  id: string;
  amount: number;
  longitude: number;
  latitude: number;
  clientId: number;
  paymentMethod: PaymentMethod;

  constructor(
    id?: string,
    amount?: number,
    longitude?: number,
    latitude?: number,
    clientId?: number,
    paymentMethod?: PaymentMethod
  ) {
    this.id = id || uuid();
    this.amount = amount || 0;
    this.longitude = longitude || 0;
    this.latitude = latitude || 0;
    this.clientId = clientId || 0;
    this.paymentMethod = paymentMethod || PaymentMethod.CASH;
  }
}
