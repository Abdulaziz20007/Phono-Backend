import { Injectable } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductImageService {
  constructor(private readonly prisma: PrismaService) {}
  create(createProductImageDto: CreateProductImageDto) {
    return this.prisma.productImage.create({
      data: createProductImageDto,
    });
  }

  findAll() {
    return this.prisma.productImage.findMany();
  }

  findOne(id: number) {
    return this.prisma.productImage.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProductImageDto: UpdateProductImageDto) {
    return this.prisma.productImage.update({
      where: { id },
      data: updateProductImageDto,
    });
  }

  remove(id: number) {
    return this.prisma.productImage.delete({
      where: { id },
    });
  }
}
