import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    Put,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderVM } from './vms/order.vm';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { ApiResponse } from '@nestjs/swagger';


@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @ApiResponse({ status: 200, type: [OrderVM] })
    @Get()
    getAll(@Query() query: GetOrdersDto): OrderVM[] {
        if (Object.keys(query).length) {
            const orders = this.ordersService.getAll(query);
            return orders.map(order => new OrderVM(order));
        }
        const orders = this.ordersService.getAll({});
        return orders.map(order => new OrderVM(order));
    }

    @ApiResponse({ status: 200, type: OrderVM })
    @Get(':id')
    getById(@Param('id') id: string): OrderVM {
        return this.ordersService.getById(id);
    }

    @ApiResponse({ status: 201, type: OrderVM }) // for swagger
    @Post()
    @HttpCode(201) // for nest
    create(@Body() request: CreateOrderDto): OrderVM {
        return this.ordersService.create(request);
    }

    @ApiResponse({ status: 201, type: OrderVM })
    @ApiResponse({ status: 404, type: Error })
    @Put(':id')
    update(@Param('id') id: string, @Body() request: UpdateOrderDto): OrderVM {
        const updatedOrder = this.ordersService.update(id, request);
        if (!updatedOrder) throw new Error('Order not found');
        return updatedOrder
    }

    @ApiResponse({ status: 204 })
    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: string) {
        this.ordersService.delete(id);
    }
}
