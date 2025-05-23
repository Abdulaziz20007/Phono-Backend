import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);

    const { phone, password, name, surname } = createUserDto;

    return this.prisma.user.create({
      data: {
        phone,
        password,
        name,
        surname,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        addresses: true,
        additional_phones: true,
        emails: true,
        favourite_items: true,
        payments: true,
        products: true,
        comments: true,
        blocks: true,
        otps: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        additional_phones: true,
        emails: true,
        favourite_items: true,
        payments: true,
        products: true,
        comments: true,
        blocks: true,
        otps: true,
      },
    });
  }

  async profile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!user) return null;
    const { password, refresh_token, balance, ...rest } = user;
    return rest;
  }

  findByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: { phone },
      include: {
        addresses: true,
        additional_phones: true,
        emails: true,
        favourite_items: true,
        payments: true,
        products: true,
        comments: true,
        blocks: true,
        otps: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        addresses: true,
        additional_phones: true,
        emails: true,
        favourite_items: true,
        payments: true,
        products: true,
        comments: true,
        blocks: true,
        otps: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
