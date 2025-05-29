import { Module } from '@nestjs/common';
import { WebService } from './web.service';
import { WebController } from './web.controller';
import { ProductModule } from '../product/product.module';
import { BrandModule } from '../brand/brand.module';

@Module({
  imports: [ProductModule, BrandModule],
  controllers: [WebController],
  providers: [WebService],
})
export class WebModule {}
