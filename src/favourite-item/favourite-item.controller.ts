import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { FavouriteItemService } from './favourite-item.service';
import { CreateFavouriteItemDto } from './dto/create-favourite-item.dto';
import { FavouriteItem } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('favourite-items')
@Roles(Role.USER)
export class FavouriteItemController {
  constructor(private readonly favouriteItemService: FavouriteItemService) {}

  @Post()
  @HttpCode(201)
  create(
    @Body() createFavouriteItemDto: CreateFavouriteItemDto,
    @GetUser() user: UserType | AdminType,
  ): Promise<FavouriteItem> {
    return this.favouriteItemService.create({
      ...createFavouriteItemDto,
      user_id: user.id,
    });
  }

  @Get('user/:userId')
  findAllByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<FavouriteItem[]> {
    // Ensure user can only access their own favorite items
    if (user.role !== Role.ADMIN && user.id !== userId) {
      userId = user.id;
    }
    return this.favouriteItemService.findAllByUserId(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<FavouriteItem> {
    const item = await this.favouriteItemService.findOne(id);

    // Check if the user is trying to access their own item
    if (user.role !== Role.ADMIN && item.user_id !== user.id) {
      throw new ForbiddenException(
        'You can only access your own favorite items',
      );
    }

    return item;
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<{ message: string }> {
    const item = await this.favouriteItemService.findOne(id);

    // Check if the user is trying to delete their own item
    if (user.role !== Role.ADMIN && item.user_id !== user.id) {
      throw new ForbiddenException(
        'You can only delete your own favorite items',
      );
    }

    return this.favouriteItemService.remove(id, user);
  }

  @Delete('user/:userId/product/:productId')
  @HttpCode(200)
  async removeByProductAndUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<{ message: string }> {
    // Ensure user can only delete their own favorite items
    if (user.role !== Role.ADMIN && user.id !== userId) {
      userId = user.id;
    }
    return this.favouriteItemService.removeByProductIdAndUserId(
      productId,
      userId,
      user,
    );
  }
}
