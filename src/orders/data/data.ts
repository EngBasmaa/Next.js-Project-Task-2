import { v4 as uuid } from 'uuid';
import { PaymentMethod } from '../enums/payment-method.enum';
import { Order } from '../entities/order.entity'; // أو entities

export const orders: Order[] = [
  {
    id: uuid(),
    amount: 1230.5,
    longitude: 23.21,
    latitude: 31.01,
    clientId: 1,
    paymentMethod: PaymentMethod.CASH,
  },
  {
    id: uuid(),
    amount: 7000,
    longitude: 70.12,
    latitude: 7.98,
    clientId: 7,
    paymentMethod: PaymentMethod.VISA,
  },
];
