import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston-logger';
import { AllExceptionsFilter } from './common/logger/error.handling';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const PORT = process.env.PORT ?? 3001;
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
    });

    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Accept,Authorization',
      credentials: true,
    });

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    // app.useGlobalFilters(new AllExceptionsFilter());
    // app.setGlobalPrefix('api');

    // Apply JWT and Roles guards globally
    const jwtAuthGuard = app.get(JwtAuthGuard);
    const rolesGuard = app.get(RolesGuard);
    app.useGlobalGuards(jwtAuthGuard, rolesGuard);

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
      console.log(
        `Swagger documentation available at: http://localhost:${PORT}/docs`,
      );
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

bootstrap();
