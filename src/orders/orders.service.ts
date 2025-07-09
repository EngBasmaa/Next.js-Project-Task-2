import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLogger } from '../logger/custom.logger';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderVM } from './vms/order.vm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private readonly logger: CustomLogger
    ) { }

    async getAll(filters: Partial<GetOrdersDto>): Promise<Order[]> {
        this.logger.debug(`Getting all orders with filters: ${JSON.stringify(filters)}`, 'OrdersService');

        if (Object.keys(filters).length) {
            const query = this.ordersRepository.createQueryBuilder('order');

            if (filters.clientId) {
                query.andWhere('order.clientId = :clientId', { clientId: filters.clientId });
            }
            if (filters.paymentMethod) {
                query.andWhere('order.paymentMethod = :paymentMethod', { paymentMethod: filters.paymentMethod });
            }

            const orders = await query.getMany();
            this.logger.log(`Retrieved ${orders.length} orders with filters`, 'OrdersService');
            return orders;
        }

        const orders = await this.ordersRepository.find();
        this.logger.log(`Retrieved ${orders.length} orders`, 'OrdersService');
        return orders;
    }

    async getById(id: string): Promise<OrderVM> {
        this.logger.debug(`Getting order by ID: ${id}`, 'OrdersService');

        const found = await this.ordersRepository.findOne({ where: { id } });
        if (!found) {
            this.logger.warn(`Order not found with ID: ${id}`, 'OrdersService');
            throw new NotFoundException('Order not found');
        }

        this.logger.debug(`Order found with ID: ${id}`, 'OrdersService');
        return Object.assign(new OrderVM(), found);
    }

    async create(dto: CreateOrderDto): Promise<OrderVM> {
        this.logger.debug(`Creating new order: ${JSON.stringify(dto)}`, 'OrdersService');

        const newOrder = this.ordersRepository.create({
            amount: dto.amount,
            longitude: dto.longitude,
            latitude: dto.latitude,
            clientId: dto.clientId,
            paymentMethod: dto.paymentMethod,
        });

        const savedOrder = await this.ordersRepository.save(newOrder);
        this.logger.logOrderCreated(savedOrder.id, savedOrder.clientId, savedOrder.amount, 'OrdersService');

        return Object.assign(new OrderVM(), savedOrder);
    }

    async update(id: string, dto: UpdateOrderDto): Promise<OrderVM> {
        this.logger.debug(`Updating order ${id} with data: ${JSON.stringify(dto)}`, 'OrdersService');

        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            this.logger.warn(`Order not found for update with ID: ${id}`, 'OrdersService');
            throw new NotFoundException('Order not found');
        }

        // Track changes
        const changes: any = {};

        // Update only provided fields
        if (dto.amount !== undefined) {
            changes.amount = { from: order.amount, to: dto.amount };
            order.amount = dto.amount;
        }
        if (dto.longitude !== undefined) {
            changes.longitude = { from: order.longitude, to: dto.longitude };
            order.longitude = dto.longitude;
        }
        if (dto.latitude !== undefined) {
            changes.latitude = { from: order.latitude, to: dto.latitude };
            order.latitude = dto.latitude;
        }
        if (dto.clientId !== undefined) {
            changes.clientId = { from: order.clientId, to: dto.clientId };
            order.clientId = dto.clientId;
        }
        if (dto.paymentMethod !== undefined) {
            changes.paymentMethod = { from: order.paymentMethod, to: dto.paymentMethod };
            order.paymentMethod = dto.paymentMethod;
        }

        const updatedOrder = await this.ordersRepository.save(order);
        this.logger.logOrderUpdated(id, changes, 'OrdersService');

        return Object.assign(new OrderVM(), updatedOrder);
    }

    async delete(id: string): Promise<void> {
        this.logger.debug(`Deleting order with ID: ${id}`, 'OrdersService');

        const deleteResult = await this.ordersRepository.delete({ id });
        if (deleteResult.affected === 0) {
            this.logger.warn(`Order not found for deletion with ID: ${id}`, 'OrdersService');
            throw new NotFoundException('Order not found');
        }

        this.logger.logOrderDeleted(id, 'OrdersService');
    }
}
