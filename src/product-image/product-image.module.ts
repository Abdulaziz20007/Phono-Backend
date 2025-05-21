import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileAmazonService } from '../file-amazon/file-amazon.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductImageController],
  providers: [ProductImageService, FileAmazonService],
})
export class ProductImageModule {}
