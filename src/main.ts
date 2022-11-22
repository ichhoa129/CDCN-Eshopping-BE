import { SERVER_PORT } from '@config/env';
import { GlobalExceptionsFilter } from '@core/filters/global-exception-filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
  OpenAPIObject,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { debuglog } from 'util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );
  const swaggerSetupOptions: SwaggerCustomOptions = {
    explorer: true,
    swaggerOptions: {
      docExpansion: false,
      deepLinking: true,
    },
  };

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Eshopping API')
      .setDescription('Eshopping services')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'token',
          description: 'Enter JWT token',
          in: 'header',
        },
        'token',
      )
      .setContact('Ích Hòa', 'https://ichhoa.dev/', 'ichhoa129@gmail.com')
      .build(),
    {
      deepScanRoutes: true,
    },
  );

  SwaggerModule.setup('docs', app, document, swaggerSetupOptions);

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.useGlobalFilters(new GlobalExceptionsFilter());
  await app.listen(SERVER_PORT);
  debuglog(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
