import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { orders as data } from './data/data';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderVM } from './vms/order.vm';
import { OrdersRepository } from './repositories/order.repository';

@Injectable()
export class OrdersService {
    constructor(private ordersRepository: OrdersRepository) { }
    private orders: Order[] = data;

    getAll(filters: Partial<GetOrdersDto>): Order[] {
        if (Object.keys(filters).length) {
            let result = this.orders;
            if (filters.clientId) {
                result = result.filter(o => String(o.clientId) === String(filters.clientId));
            }
            if (filters.paymentMethod) {
                result = result.filter(o => o.paymentMethod === filters.paymentMethod);
            }
            return result;
        }
        return this.orders;
    }


    getById(id: string): OrderVM {

        const found = this.orders.find(o => o.id === id);
        if (!found) throw new NotFoundException('Order not found');
        return new OrderVM(found);
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
