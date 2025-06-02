import { Module } from '@nestjs/common';
import { WebService } from './web.service';
import { WebController } from './web.controller';
import { ProductModule } from '../product/product.module';
import { BrandModule } from '../brand/brand.module';
import { ColorModule } from '../color/color.module';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [ProductModule, BrandModule, ColorModule, RegionModule],
  controllers: [WebController],
  providers: [WebService],
})
export class WebModule {}
