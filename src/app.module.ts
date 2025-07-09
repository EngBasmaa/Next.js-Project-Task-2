import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    LoggerModule,
    OrdersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Hbosy@2020',
      database: 'orders-management',
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    })
  ],
})
export class AppModule { }
