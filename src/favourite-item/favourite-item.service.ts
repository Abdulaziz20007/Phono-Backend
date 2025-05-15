import { Injectable } from '@nestjs/common';
import { CreateFavouriteItemDto } from './dto/create-favourite-item.dto';
import { UpdateFavouriteItemDto } from './dto/update-favourite-item.dto';

@Injectable()
export class FavouriteItemService {
  create(createFavouriteItemDto: CreateFavouriteItemDto) {
    return 'This action adds a new favouriteItem';
  }

  findAll() {
    return `This action returns all favouriteItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favouriteItem`;
  }

  update(id: number, updateFavouriteItemDto: UpdateFavouriteItemDto) {
    return `This action updates a #${id} favouriteItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} favouriteItem`;
  }
}
