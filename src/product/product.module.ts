import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
<<<<<<< HEAD
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
=======

@Module({
>>>>>>> b20a6394698a42480cfe66dd0444c030c89c2dbd
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
