import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PaymentMethod } from '../enums/payment-method.enum';

@Entity('orders')
export class Order {
  // @PrimaryGeneratedColumn() // '1','2','3', ....
  @PrimaryGeneratedColumn('uuid')  // random long string
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, default: 0 })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, default: 0 })
  latitude: number;

  @Column({ type: 'int' })
  clientId: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH
  })
  paymentMethod: PaymentMethod;

  constructor(
    id?: string,
    amount?: number,
    longitude?: number,
    latitude?: number,
    clientId?: number,
    paymentMethod?: PaymentMethod,
  ) {
    this.id = id || uuid();
    this.amount = amount || 0;
    this.longitude = longitude || 0;
    this.latitude = latitude || 0;
    this.clientId = clientId || 0;
    this.paymentMethod = paymentMethod || PaymentMethod.CASH;
  }
}
