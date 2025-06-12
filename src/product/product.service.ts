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
import { SearchProductDto } from './dto/search-product.dto';
import { ArchiveProductDto } from './dto/archive-product.dto';

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
        color: true,
        currency: true,
        address: true,
        contact_phone: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
            phone: true,
            addresses: {
              select: { id: true, address: true, lat: true, long: true },
            },
            additional_phones: { select: { id: true, phone: true } },
            emails: { select: { id: true, email: true } },
            products: {
              select: {
                id: true,
                title: true,
                images: { select: { id: true, url: true } },
              },
            },
          },
        },
      },
    });
  }

  findUserProducts(user_id: number) {
    return this.prisma.product.findMany({
      where: { user_id },
      include: {
        images: true,
        brand: true,
        model: true,
        color: true,
        currency: true,
        address: true,
        contact_phone: true,
      },
    });
  }

  findByBrandId(brand_id: number) {
    return this.prisma.product.findMany({
      where: { brand_id },
      include: {
        images: true,
        brand: true,
        model: true,
        color: true,
        currency: true,
        address: true,
        contact_phone: true,
      },
    });
  }

  findByModelId(model_id: number) {
    return this.prisma.product.findMany({
      where: { model_id },
      include: {
        images: true,
        brand: true,
        model: true,
        color: true,
        currency: true,
        address: true,
        contact_phone: true,
      },
    });
  }

  search(searchProductDto: SearchProductDto) {
    const {
      search,
      region_id,
      category_id,
      brand_id,
      color_id,
      price_from,
      price_to,
      memory_from,
      memory_to,
      ram_from,
      ram_to,
      top,
    } = searchProductDto;

    const where: any = {
      title: { contains: search, mode: 'insensitive' },
      is_archived: false,
      is_sold: false,
      is_checked: true,
    };

    if (region_id) {
      where.address = {
        region_id,
      };
    }

    if (category_id) where.category_id = category_id;
    if (brand_id) where.brand_id = brand_id;
    if (color_id) where.color_id = color_id;

    if (price_from || price_to) {
      where.price = {};
      if (price_from) where.price.gte = price_from;
      if (price_to) where.price.lte = price_to;
    }

    if (memory_from || memory_to) {
      where.storage = {};
      if (memory_from) where.storage.gte = memory_from;
      if (memory_to) where.storage.lte = memory_to;
    }

    if (ram_from || ram_to) {
      where.ram = {};
      if (ram_from) where.ram.gte = ram_from;
      if (ram_to) where.ram.lte = ram_to;
    }

    if (top === false) {
      where.top_expire_date = {
        gt: new Date(),
      };
    }

    return this.prisma.product.findMany({
      where,
      include: {
        images: true,
        brand: true,
        model: true,
        color: true,
        currency: true,
        address: true,
        contact_phone: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
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
        color: true,
        currency: true,
        address: true,
        contact_phone: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
            phone: true,
            addresses: {
              select: { id: true, address: true, lat: true, long: true },
            },
            additional_phones: { select: { id: true, phone: true } },
            emails: { select: { id: true, email: true } },
            products: {
              select: {
                id: true,
                title: true,
                is_new: true,
                storage: true,
                price: true,
                floor_price: true,
                images: { select: { id: true, url: true } },
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async archive(
    id: number,
    archiveProductDto: ArchiveProductDto,
    user: UserType | AdminType,
  ) {
    const product = await this.prisma.product.findUnique({
      where: user.role == 'ADMIN' ? { id } : { id, user_id: user.id },
    });

    if (!product) {
      throw new NotFoundException('Product topilmadi');
    }
    if (product.is_archived) {
      throw new BadRequestException('Product allaqachon arxivga olingan');
    }
    if (product.is_sold) {
      throw new BadRequestException('Product sotilgan');
    }
    return this.prisma.product.update({
      where: user.role == 'ADMIN' ? { id } : { id, user_id: user.id },
      data: { is_archived: true, is_sold: archiveProductDto.is_sold || false },
    });
  }

  async unarchive(id: number, user: UserType | AdminType) {
    const product = await this.prisma.product.findUnique({
      where: user.role == 'ADMIN' ? { id } : { id, user_id: user.id },
    });
    if (!product) {
      throw new NotFoundException('Product topilmadi');
    }
    if (!product.is_archived) {
      throw new BadRequestException('Product allaqachon arxivga olingan emas');
    }
    return this.prisma.product.update({
      where: user.role == 'ADMIN' ? { id } : { id, user_id: user.id },
      data: { is_archived: false, is_sold: false },
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
