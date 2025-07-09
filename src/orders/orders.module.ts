import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './repositories/order.repository';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  imports: [TypeOrmModule.forFeature([Order])], // registeration to enable dependency injection of repositories
})
export class OrdersModule { }
