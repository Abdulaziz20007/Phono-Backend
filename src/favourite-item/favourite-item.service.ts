import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavouriteItemDto } from './dto/create-favourite-item.dto';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Injectable()
export class FavouriteItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createFavouriteItemDto: CreateFavouriteItemDto,
    user: UserType | AdminType,
  ) {
    const userId =
      user.role === 'ADMIN' && createFavouriteItemDto.user_id
        ? createFavouriteItemDto.user_id
        : user.id;

    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new BadRequestException(`Foydalanuvchi topilmadi`);
    }

    const productExists = await this.prismaService.product.findUnique({
      where: { id: createFavouriteItemDto.product_id },
    });
    if (!productExists) {
      throw new BadRequestException(`Mahsulot topilmadi`);
    }

    const alreadyExists = await this.prismaService.favouriteItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: createFavouriteItemDto.product_id,
        },
      },
    });
    if (alreadyExists) {
      throw new BadRequestException(`Mahsulot allaqachon sevimlilarda`);
    }

    const favourite = await this.prismaService.favouriteItem.create({
      data: {
        user_id: userId,
        product_id: createFavouriteItemDto.product_id,
      },
    });
    return favourite;
  }

  async userFavouriteItem(productId: number, user: UserType) {
    const userId = user.id;

    const productExists = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      throw new BadRequestException(`Mahsulot topilmadi`);
    }

    const alreadyExists = await this.prismaService.favouriteItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });
    if (alreadyExists) {
      throw new BadRequestException(`Mahsulot allaqachon sevimlilarda`);
    }

    const favourite = await this.prismaService.favouriteItem.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    });
    return favourite;
  }

  async removeUserFavouriteItemByProductId(productId: number, user: UserType) {
    const userId = user.id;

    const favouriteItem = await this.prismaService.favouriteItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    if (!favouriteItem) {
      throw new NotFoundException(
        `Ushbu mahsulot sizning sevimlilaringizda topilmadi`,
      );
    }

    await this.prismaService.favouriteItem.delete({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    return { message: "Mahsulot sevimlilardan muvaffaqiyatli o'chirildi" };
  }

  async findAll(user: UserType | AdminType) {
    const where = user.role === 'ADMIN' ? {} : { user_id: user.id };
    return this.prismaService.favouriteItem.findMany({
      where,
      include: { product: true },
    });
  }

  async findOne(id: number, user: UserType | AdminType) {
    const where = user.role === 'ADMIN' ? { id } : { id, user_id: user.id };
    const favourite = await this.prismaService.favouriteItem.findUnique({
      where,
      include: { product: true },
    });
    if (!favourite) {
      throw new NotFoundException('Sevimli mahsulot topilmadi');
    }
    return favourite;
  }

  async remove(id: number, user: UserType | AdminType) {
    const whereForFind =
      user.role === 'ADMIN' ? { id } : { id, user_id: user.id };
    const favourite = await this.prismaService.favouriteItem.findUnique({
      where: whereForFind,
    });

    if (!favourite) {
      throw new NotFoundException('Sevimli mahsulot topilmadi');
    }

    if (user.role !== 'ADMIN' && favourite.user_id !== user.id) {
      throw new ForbiddenException('Ruxsat yo‘q');
    }

    await this.prismaService.favouriteItem.delete({
      where: { id: id },
    });
    return { message: "Sevimli mahsulot o'chirildi" };
  }
}
