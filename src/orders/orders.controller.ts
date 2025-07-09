import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrdersService } from './orders.service';
import { OrderVM } from './vms/order.vm';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @ApiResponse({ status: 200, type: [OrderVM] })
    @Get()
    async getAll(@Query() query: GetOrdersDto): Promise<OrderVM[]> {
        if (Object.keys(query).length) {
            const orders = await this.ordersService.getAll(query);
            return orders.map(order => Object.assign(new OrderVM(), order));
        }
        const orders = await this.ordersService.getAll({});
        return orders.map(order => Object.assign(new OrderVM(), order));
    }

    @ApiResponse({ status: 200, type: OrderVM })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<OrderVM> {
        return await this.ordersService.getById(id);
    }

    @ApiResponse({ status: 201, type: OrderVM }) // for swagger
    @Post()
    @HttpCode(201) // for nest
    async create(@Body() request: CreateOrderDto): Promise<OrderVM> {
        return await this.ordersService.create(request);
    }

    @ApiResponse({ status: 201, type: OrderVM })
    @ApiResponse({ status: 404, type: Error })
    @Put(':id')
    async update(@Param('id') id: string, @Body() request: UpdateOrderDto): Promise<OrderVM> {
        const updatedOrder = await this.ordersService.update(id, request);
        if (!updatedOrder) throw new Error('Order not found');
        return updatedOrder;
    }

    @ApiResponse({ status: 204 })
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        await this.ordersService.delete(id);
    }
}
