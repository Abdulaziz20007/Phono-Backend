import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { selfGuard } from '../common/self-guard';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto, user: UserType | AdminType) {
    const user_id =
      user.role == 'ADMIN' || user.role == 'SUPERADMIN'
        ? createProductDto.user_id
        : user.id;
    return this.prisma.product.create({
      data: { ...createProductDto, user_id },
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: UserType | AdminType,
  ) {
    const user_id =
      user.role == 'ADMIN' || user.role == 'SUPERADMIN'
        ? updateProductDto.user_id
        : user.id;
    return this.prisma.product.update({
      where: { id, user_id },
      data: updateProductDto,
    });
  }

  remove(id: number, user: UserType | AdminType) {
    const where = user.role == 'USER' ? { id, user_id: user.id } : { id };
    return this.prisma.product.delete({
      where,
    });
  }
}
