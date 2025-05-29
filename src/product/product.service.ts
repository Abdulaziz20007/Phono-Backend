import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { UpgradeProductDto } from './dto/upgrade-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto, user: UserType | AdminType) {
    const user_id = user.role == 'ADMIN' ? createProductDto.user_id! : user.id;

    console.log({ ...createProductDto, user_id });

    return this.prisma.product.create({
      data: { ...createProductDto, user_id },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        images: true,
        brand: true,
        model: true,
        user: true,
      },
    });
  }

  findUserProducts(user_id: number) {
    return this.prisma.product.findMany({
      where: { user_id },
      include: {
        images: true,
      },
    });
  }

  findByBrandId(brand_id: number) {
    return this.prisma.product.findMany({
      where: { brand_id },
      include: {
        images: true,
      },
    });
  }

  findByModelId(model_id: number) {
    return this.prisma.product.findMany({
      where: { model_id },
      include: {
        images: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        brand: true,
        model: true,
        user: true,
      },
    });
  }

  update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: UserType | AdminType,
  ) {
    const user_id = user.role == 'ADMIN' ? updateProductDto.user_id : user.id;
    return this.prisma.product.update({
      where: { id, user_id },
      data: updateProductDto,
    });
  }

  async upgrade(
    id: number,
    user: UserType | AdminType,
    upgradeProductDto: UpgradeProductDto,
  ) {
    const user_id = user.role == 'ADMIN' ? upgradeProductDto.user_id : user.id;
    const product = await this.prisma.product.findFirst({
      where: { id, user_id },
    });
    if (!product) {
      throw new NotFoundException('Product topilmadi');
    }
    if (product.top_expire_date > new Date()) {
      throw new BadRequestException('Product allaqachon topga yuklangan');
    }
    const thisUser = await this.prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!thisUser) {
      throw new NotFoundException('User topilmadi');
    }
    if (thisUser.balance < 10000) {
      throw new BadRequestException('Balans yetarli emas');
    }
    const top_expire_date = new Date();
    top_expire_date.setDate(top_expire_date.getDate() + 7);
    await this.prisma.product.update({
      where: { id },
      data: { top_expire_date },
    });
    await this.prisma.user.update({
      where: { id: user_id },
      data: { balance: thisUser.balance - 10000 },
    });
    return { message: 'Product topga yuklandi' };
  }

  remove(id: number, user: UserType | AdminType) {
    const where = user.role == 'USER' ? { id, user_id: user.id } : { id };
    return this.prisma.product.delete({
      where,
    });
  }
}
