import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { PaymentMethod } from './enums/payment-method.enum';
import { Order } from './entities/order.entity';
import { orders as data } from './data/data'; // ✅ تأكد من المسار
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrdersService {
    private orders: Order[] = data;

    getAll(clientId?: number, paymentMethod?: PaymentMethod): Order[] {
        let result = this.orders;
        if (clientId) result = result.filter(o => o.clientId === clientId);
        if (paymentMethod) result = result.filter(o => o.paymentMethod === paymentMethod);
        return result;
    }

    getById(id: string): Order {
        const found = this.orders.find(o => o.id === id);
        if (!found) throw new NotFoundException('Order not found');
        return found;
    }

    create(dto: CreateOrderDto): Order {
        const newOrder: Order = {
            id: uuid(),
            ...dto,
        };
        this.orders.push(newOrder);
        return newOrder;
    }

    update(id: string, dto: UpdateOrderDto): Order {
        const order = this.getById(id);
        const updated = { ...order, ...dto };
        const index = this.orders.findIndex(o => o.id === id);
        this.orders[index] = updated;
        return updated;
    }

    delete(id: string): void {
        const index = this.orders.findIndex(o => o.id === id);
        if (index === -1) throw new NotFoundException('Order not found');
        this.orders.splice(index, 1);
    }
}
