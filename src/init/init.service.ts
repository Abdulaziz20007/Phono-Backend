import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { data } from './data/data';

@Injectable()
export class InitService {
  constructor(private readonly prisma: PrismaService) {}

  async create() {
    // Create currencies
    await this.prisma.currency.createMany({
      data: data.Currency,
      skipDuplicates: true,
    });

    // Create regions
    await this.prisma.region.createMany({
      data: data.Region,
      skipDuplicates: true,
    });

    // Create users
    await this.prisma.user.createMany({
      data: data.User,
      skipDuplicates: true,
    });

    // Create addresses
    await this.prisma.address.createMany({
      data: data.Address,
      skipDuplicates: true,
    });

    // Create admins
    await this.prisma.admin.createMany({
      data: data.Admin,
      skipDuplicates: true,
    });

    // Create brands
    await this.prisma.brand.createMany({
      data: data.Brand,
      skipDuplicates: true,
    });

    // Create colors
    await this.prisma.color.createMany({
      data: data.Color,
      skipDuplicates: true,
    });

    // Create models
    await this.prisma.model.createMany({
      data: data.Model,
      skipDuplicates: true,
    });

    // Create phones
    await this.prisma.phone.createMany({
      data: data.Phone,
      skipDuplicates: true,
    });

    // Create products
    await this.prisma.product.createMany({
      data: data.Product,
      skipDuplicates: true,
    });

    // Create payment methods
    await this.prisma.paymentMethod.createMany({
      data: data.PaymentMethod,
      skipDuplicates: true,
    });

    // Create product images
    await this.prisma.productImage.createMany({
      data: data.ProductImage,
      skipDuplicates: true,
    });

    return { message: 'Database initialized successfully' };
  }
}
