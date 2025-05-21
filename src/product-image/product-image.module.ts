import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
