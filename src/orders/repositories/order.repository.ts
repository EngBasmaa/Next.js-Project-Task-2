import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { GetOrdersDto } from '../dtos/get-orders.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersRepository {

    private repo: Repository<Order>;

    constructor(private readonly dataSource: DataSource) {
        this.repo = dataSource.getRepository(Order);
    }

    async createOrder(createDto: CreateOrderDto): Promise<Order> {
        const order = this.repo.create({
            amount: createDto.amount,
            longitude: createDto.longitude,
            latitude: createDto.latitude,
            clientId: createDto.clientId,
            paymentMethod: createDto.paymentMethod,
        });

        return await this.repo.save(order);
    }

    async getAllOrders(): Promise<Order[]> {
        // Lazy Loading (SELECT on Order Table only)
        return await this.repo.find();
    }

    async getAllOrdersWithEagerLoading(): Promise<Order[]> {
        // Eager Loading ( SELECT * + Left Join )
        return await this.repo.find();
    }

    async getAllOrdersWithSelectiveLoading(): Promise<Order[]> {
        // Selective Loading ( Select specific columns )
        return await this.repo.createQueryBuilder('order')
            .select([
                'order.id',
                'order.amount',
                'order.longitude',
                'order.latitude',
                'order.clientId',
                'order.paymentMethod'
            ])
            .getMany();
    }

    async getAllOrdersWithFilters(ordersFilterDto: GetOrdersDto): Promise<Order[]> {
        const query = this.repo.createQueryBuilder('order');

        if (ordersFilterDto.clientId) {
            query.andWhere('order.clientId = :clientId', { clientId: ordersFilterDto.clientId });
        }

        if (ordersFilterDto.paymentMethod) {
            query.andWhere('order.paymentMethod = :paymentMethod', { paymentMethod: ordersFilterDto.paymentMethod });
        }

        return await query.getMany();
    }

    async getOrderById(id: string): Promise<Order | null> {
        return await this.repo.findOne({
            where: { id },
        });
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
        const order = await this.repo.findOneBy({ id });
        if (order) {
            if (updateOrderDto.amount !== undefined) order.amount = updateOrderDto.amount;
            if (updateOrderDto.longitude !== undefined) order.longitude = updateOrderDto.longitude;
            if (updateOrderDto.latitude !== undefined) order.latitude = updateOrderDto.latitude;
            if (updateOrderDto.clientId !== undefined) order.clientId = updateOrderDto.clientId;
            if (updateOrderDto.paymentMethod !== undefined) order.paymentMethod = updateOrderDto.paymentMethod;
            await this.repo.save(order);
        }
        return order;
    }

    async deleteOrderById(id: string): Promise<boolean> {
        const deleteResult = await this.repo.delete(id);
        return deleteResult.affected != null && deleteResult.affected > 0;
    }
}
