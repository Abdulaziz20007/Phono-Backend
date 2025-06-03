import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileAmazonModule } from '../file-amazon/file-amazon.module';

@Module({
  imports: [PrismaModule, FileAmazonModule],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
