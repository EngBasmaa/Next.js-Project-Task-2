import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { GetOrdersDto } from '../dtos/get-orders.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Order } from '../entities/order.entity';
import { PaymentMethod } from '../enums/payment-method.enum';

@Injectable()
export class OrdersRepository {

    private repo: Repository<Order>;

    constructor(@InjectDataSource() dataSource: DataSource) {
        this.repo = dataSource.getRepository(Order);
    }

    async createOrder(createDto: CreateOrderDto): Promise<Order> {
        try {
            const order = this.repo.create({
                amount: createDto.amount,
                longitude: createDto.longitude,
                latitude: createDto.latitude,
                clientId: createDto.clientId,
                paymentMethod: createDto.paymentMethod,
            });

            return await this.repo.save(order);
        } catch (error) {
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }

    async getAllOrders(): Promise<Order[]> {
        try {
            return await this.repo.find({
                order: { id: 'DESC' }
            });
        } catch (error) {
            throw new Error(`Failed to fetch orders: ${error.message}`);
        }
    }

    async getAllOrdersWithPagination(page: number = 1, limit: number = 10): Promise<{ orders: Order[], total: number }> {
        try {
            const [orders, total] = await this.repo.findAndCount({
                order: { id: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });

            return { orders, total };
        } catch (error) {
            throw new Error(`Failed to fetch orders with pagination: ${error.message}`);
        }
    }

    async getAllOrdersWithFilters(ordersFilterDto: GetOrdersDto): Promise<Order[]> {
        try {
            const query = this.repo.createQueryBuilder('order');

            if (ordersFilterDto.clientId) {
                query.andWhere('order.clientId = :clientId', { clientId: ordersFilterDto.clientId });
            }

            if (ordersFilterDto.paymentMethod) {
                query.andWhere('order.paymentMethod = :paymentMethod', { paymentMethod: ordersFilterDto.paymentMethod });
            }

            return await query.orderBy('order.id', 'DESC').getMany();
        } catch (error) {
            throw new Error(`Failed to fetch orders with filters: ${error.message}`);
        }
    }

    async getOrderById(id: string): Promise<Order> {
        try {
            const order = await this.repo.findOne({
                where: { id },
            });

            if (!order) {
                throw new NotFoundException(`Order with ID ${id} not found`);
            }

            return order;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch order: ${error.message}`);
        }
    }

    async getOrdersByClientId(clientId: number): Promise<Order[]> {
        try {
            return await this.repo.find({
                where: { clientId },
                order: { id: 'DESC' }
            });
        } catch (error) {
            throw new Error(`Failed to fetch orders by client ID: ${error.message}`);
        }
    }

    async getOrdersByPaymentMethod(paymentMethod: PaymentMethod): Promise<Order[]> {
        try {
            return await this.repo.find({
                where: { paymentMethod },
                order: { id: 'DESC' }
            });
        } catch (error) {
            throw new Error(`Failed to fetch orders by payment method: ${error.message}`);
        }
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        try {
            const order = await this.repo.findOne({ where: { id } });

            if (!order) {
                throw new NotFoundException(`Order with ID ${id} not found`);
            }

            // Update only provided fields
            if (updateOrderDto.amount !== undefined) order.amount = updateOrderDto.amount;
            if (updateOrderDto.longitude !== undefined) order.longitude = updateOrderDto.longitude;
            if (updateOrderDto.latitude !== undefined) order.latitude = updateOrderDto.latitude;
            if (updateOrderDto.clientId !== undefined) order.clientId = updateOrderDto.clientId;
            if (updateOrderDto.paymentMethod !== undefined) order.paymentMethod = updateOrderDto.paymentMethod;

            return await this.repo.save(order);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update order: ${error.message}`);
        }
    }

    async deleteOrderById(id: string): Promise<void> {
        try {
            const deleteResult = await this.repo.delete(id);

            if (deleteResult.affected === 0) {
                throw new NotFoundException(`Order with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete order: ${error.message}`);
        }
    }

    async getOrdersCount(): Promise<number> {
        try {
            return await this.repo.count();
        } catch (error) {
            throw new Error(`Failed to get orders count: ${error.message}`);
        }
    }

    async getOrdersWithTotalAmount(): Promise<{ totalAmount: number, orderCount: number }> {
        try {
            const result = await this.repo.createQueryBuilder('order')
                .select('SUM(order.amount)', 'totalAmount')
                .addSelect('COUNT(order.id)', 'orderCount')
                .getRawOne();

            return {
                totalAmount: parseFloat(result.totalAmount) || 0,
                orderCount: parseInt(result.orderCount) || 0
            };
        } catch (error) {
            throw new Error(`Failed to get orders statistics: ${error.message}`);
        }
    }
}
