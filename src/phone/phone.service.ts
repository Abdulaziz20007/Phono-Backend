import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { selfGuard } from '../common/self-guard';
import { phoneChecker } from '../common/phone';

@Injectable()
export class PhoneService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createPhoneDto: CreatePhoneDto,
    user: UserType | AdminType | any,
  ) {
    const userId = user.role === 'ADMIN' ? createPhoneDto.user_id! : user.id;

    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new BadRequestException(`Foydalanuvchi topilmadi`);
    }

    if (!phoneChecker(createPhoneDto.phone)) {
      throw new BadRequestException(`Telefon raqam noto'g'ri`);
    }

    return this.prismaService.phone.create({
      data: {
        ...createPhoneDto,
        user_id: userId,
      },
    });
  }

  async findAll(user: UserType | AdminType) {
    return this.prismaService.phone.findMany({
      where:
        user.role === 'ADMIN' ? { user_id: user.id } : { user_id: user.id },
    });
  }

  async findOne(id: number, user: UserType | AdminType) {
    const phone = await this.prismaService.phone.findUnique({
      where: {
        id: id,
        ...(user.role !== 'ADMIN' && { user_id: user.id }),
      },
    });
    if (!phone) {
      throw new NotFoundException('Telefon raqami topilmadi');
    }
    return phone;
  }

  async update(
    id: number,
    updatePhoneDto: UpdatePhoneDto,
    user: UserType | AdminType,
  ) {
    const phone = await this.prismaService.phone.findUnique({
      where: { id },
    });
    if (!phone) {
      throw new NotFoundException('Telefon raqami topilmadi');
    }
    if (updatePhoneDto.phone && !phoneChecker(updatePhoneDto.phone)) {
      throw new BadRequestException(`Telefon raqam noto'g'ri`);
    }
    selfGuard(user.id, phone);

    if (updatePhoneDto.user_id) {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: updatePhoneDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `IDsi ${updatePhoneDto.user_id} bo'lgan foydalanuvchi topilmadi.`,
        );
      }
    }

    return this.prismaService.phone.update({
      where: { id },
      data: updatePhoneDto,
    });
  }

  async remove(id: number, user: UserType | AdminType) {
    const phone = await this.prismaService.phone.findUnique({
      where: { id },
    });
    const mainPhone = user.phone;
    if (!phone) {
      throw new NotFoundException('Telefon raqami topilmadi');
    }
    if (mainPhone === phone.phone) {
      throw new BadRequestException(
        "Asosiy telefon raqamni o'chirish mumkin emas",
      );
    }
    selfGuard(user.id, phone);

    await this.prismaService.phone.delete({
      where: { id },
    });
    return { message: "Telefon raqami o'chirildi" };
  }
}
