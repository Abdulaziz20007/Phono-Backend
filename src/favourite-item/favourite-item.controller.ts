import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  // UseGuards, // Agar global guardlaringiz bo'lsa, bu kerak emas
} from '@nestjs/common';
import { FavouriteItemService } from './favourite-item.service';
import { CreateFavouriteItemDto } from './dto/create-favourite-item.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('favourite-item')
export class FavouriteItemController {
  constructor(private readonly favouriteItemService: FavouriteItemService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  create(
    @Body() createFavouriteItemDto: CreateFavouriteItemDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.favouriteItemService.create(createFavouriteItemDto, user);
  }

  @Post('/user/add')
  @Roles(Role.USER)
  async addUserFavouriteItem(
    @Body() createFavouriteItemDto: CreateFavouriteItemDto,
    @GetUser() user: UserType,
  ) {
    return this.favouriteItemService.userFavouriteItem(
      createFavouriteItemDto.product_id,
      user,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  findAll(@GetUser() user: UserType | AdminType) {
    return this.favouriteItemService.findAll(user);
  }

  @Get(':id') // Bu favourite_item ning ID si bo'yicha topadi
  @Roles(Role.ADMIN, Role.USER)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.favouriteItemService.findOne(id, user);
  }

  // YANGI O'CHIRISH ENDPOINTI (USER uchun product_id bo'yicha)
  @Delete('/user/product/:productId')
  @Roles(Role.USER) // Faqat USER uchun
  @HttpCode(200) // Muvaffaqiyatli o'chirilganda 200 OK yoki 204 No Content qaytarish mumkin
  async removeUserFavouriteItem(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser() user: UserType,
  ) {
    return this.favouriteItemService.removeUserFavouriteItemByProductId(
      productId,
      user,
    );
  }

  @Delete(':id') // Bu favourite_item ning ID si bo'yicha o'chiradi
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(200)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.favouriteItemService.remove(id, user);
  }
}
