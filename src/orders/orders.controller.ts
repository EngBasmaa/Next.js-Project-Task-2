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


@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    getAll(@Query() query: GetOrdersDto): OrderVM[] {
        const clientId = query.clientId ? Number(query.clientId) : undefined;
        return this.ordersService.getAll(clientId, query.paymentMethod);
    }

    @Get(':id')
    getById(@Param('id') id: string): OrderVM {
        return this.ordersService.getById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateOrderDto): OrderVM {
        return this.ordersService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateOrderDto): OrderVM {
        return this.ordersService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string): void {
        this.ordersService.delete(id);
    }
}
