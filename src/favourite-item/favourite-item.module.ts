import { Module } from '@nestjs/common';
import { FavouriteItemService } from './favourite-item.service';
import { FavouriteItemController } from './favourite-item.controller';

@Module({
  controllers: [FavouriteItemController],
  providers: [FavouriteItemService],
})
export class FavouriteItemModule {}
