import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [OrdersModule
  ],
})
export class AppModule { }
