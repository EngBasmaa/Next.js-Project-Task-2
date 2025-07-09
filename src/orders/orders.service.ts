import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderVM } from './vms/order.vm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>
    ) { }

    async getAll(filters: Partial<GetOrdersDto>): Promise<Order[]> {
        if (Object.keys(filters).length) {
            const query = this.ordersRepository.createQueryBuilder('order');

            if (filters.clientId) {
                query.andWhere('order.clientId = :clientId', { clientId: filters.clientId });
            }
            if (filters.paymentMethod) {
                query.andWhere('order.paymentMethod = :paymentMethod', { paymentMethod: filters.paymentMethod });
            }

            return await query.getMany();
        }
        return await this.ordersRepository.find();
    }

    async getById(id: string): Promise<OrderVM> {
        const found = await this.ordersRepository.findOne({ where: { id } });
        if (!found) throw new NotFoundException('Order not found');
        return Object.assign(new OrderVM(), found);
    }

    async create(dto: CreateOrderDto): Promise<OrderVM> {
        const newOrder = this.ordersRepository.create({
            amount: dto.amount,
            longitude: dto.longitude,
            latitude: dto.latitude,
            clientId: dto.clientId,
            paymentMethod: dto.paymentMethod,
        });

        const savedOrder = await this.ordersRepository.save(newOrder);
        return Object.assign(new OrderVM(), savedOrder);
    }

    async update(id: string, dto: UpdateOrderDto): Promise<OrderVM> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Update only provided fields
        if (dto.amount !== undefined) order.amount = dto.amount;
        if (dto.longitude !== undefined) order.longitude = dto.longitude;
        if (dto.latitude !== undefined) order.latitude = dto.latitude;
        if (dto.clientId !== undefined) order.clientId = dto.clientId;
        if (dto.paymentMethod !== undefined) order.paymentMethod = dto.paymentMethod;

        const updatedOrder = await this.ordersRepository.save(order);
        return Object.assign(new OrderVM(), updatedOrder);
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await this.ordersRepository.delete({ id });
        if (deleteResult.affected === 0) {
            throw new NotFoundException('Order not found');
        }
    }
}
