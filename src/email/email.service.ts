import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed
import { Email, Prisma, User } from '@prisma/client'; // Import Prisma types
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { selfGuard } from '../common/self-guard';

@Injectable()
export class EmailService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEmailDto: CreateEmailDto, user: UserType | AdminType) {
    const userId =
      user.role === 'ADMIN' || user.role === 'SUPERADMIN'
        ? createEmailDto.user_id!
        : user.id;

    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new BadRequestException(`Foydalanuvchi topilmadi`);
    }

    return this.prismaService.email.create({
      data: {
        ...createEmailDto,
        user_id: userId,
      },
    });
  }

  async findAll(user: UserType | AdminType) {
    return this.prismaService.email.findMany({
      where:
        user.role === 'ADMIN' || user.role === 'SUPERADMIN'
          ? { user_id: user.id }
          : { user_id: user.id },
    });
  }

  async findOne(id: number, user: UserType | AdminType) {
    const email = await this.prismaService.email.findUnique({
      where:
        user.role === 'ADMIN' || user.role === 'SUPERADMIN'
          ? { id }
          : { id, user_id: user.id },
    });
    if (!email) {
      throw new NotFoundException('Email topilmadi');
    }
    return email;
  }

  async update(
    id: number,
    updateEmailDto: UpdateEmailDto,
    user: UserType | AdminType,
  ) {
    const email = await this.prismaService.email.findUnique({
      where: { id },
    });
    if (!email) {
      throw new NotFoundException('Email topilmadi');
    }
    selfGuard(user.id, email);

    if (updateEmailDto.user_id) {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: updateEmailDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `IDsi ${updateEmailDto.user_id} bo'lgan foydalanuvchi topilmadi.`,
        );
      }
    }

    return this.prismaService.email.update({
      where: { id },
      data: updateEmailDto,
    });
  }

  async remove(id: number, user: UserType | AdminType) {
    const email = await this.prismaService.email.findUnique({
      where: { id },
    });
    if (!email) {
      throw new NotFoundException('Email topilmadi');
    }
    selfGuard(user.id, email);

    await this.prismaService.email.delete({
      where: { id },
    });
    return { message: "Email o'chirildi" };
  }
}
