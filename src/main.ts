import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CustomLogger } from './logger/custom.logger';

require('dotenv').config();
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class-validator package for (validation)

  const config = new DocumentBuilder()
    .setTitle('Nest Project API Title')
    .setDescription('API description')
    .setVersion('1.0')

    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'Authorization',
    //     in: 'header',
    //   },
    // 'jwt' // This name should match the one used in @ApiBearerAuth()
    // )

    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./swagger.json', JSON.stringify(document));

  SwaggerModule.setup('swagger', app, document);

  // const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  // Add global logging interceptor
  const logger = app.get(CustomLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // const port = configService.get<number>('PORT') || 3000;

  await app.listen(process.env.PORT ?? 4000);


}
bootstrap();
