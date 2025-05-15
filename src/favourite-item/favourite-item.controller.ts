import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavouriteItemService } from './favourite-item.service';
import { CreateFavouriteItemDto } from './dto/create-favourite-item.dto';
import { UpdateFavouriteItemDto } from './dto/update-favourite-item.dto';

@Controller('favourite-item')
export class FavouriteItemController {
  constructor(private readonly favouriteItemService: FavouriteItemService) {}

  @Post()
  create(@Body() createFavouriteItemDto: CreateFavouriteItemDto) {
    return this.favouriteItemService.create(createFavouriteItemDto);
  }

  @Get()
  findAll() {
    return this.favouriteItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favouriteItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavouriteItemDto: UpdateFavouriteItemDto) {
    return this.favouriteItemService.update(+id, updateFavouriteItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favouriteItemService.remove(+id);
  }
}
