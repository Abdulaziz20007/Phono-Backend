import { Module } from '@nestjs/common';
import { FavouriteItemService } from './favourite-item.service';
import { FavouriteItemController } from './favourite-item.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FavouriteItemController],
  providers: [FavouriteItemService, PrismaService],
  exports: [FavouriteItemService],
})
export class FavouriteItemModule {}
