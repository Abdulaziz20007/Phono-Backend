import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
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

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  findAll(@GetUser() user: UserType | AdminType) {
    return this.favouriteItemService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.favouriteItemService.findOne(id, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(200)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.favouriteItemService.remove(id, user);
  }
}
