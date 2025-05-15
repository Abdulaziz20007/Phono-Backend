import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['*'],
    methods: ['*'],
    allowedHeaders: ['*'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
bootstrap();
