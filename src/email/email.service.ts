import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { selfGuard } from '../common/self-guard';
import { sendEmail } from '../common/otp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEmailDto: CreateEmailDto, user: UserType | AdminType) {
    const userId = user.role === 'ADMIN' ? createEmailDto.user_id! : user.id;

    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new BadRequestException(`Foydalanuvchi topilmadi`);
    }

    const emailExists = await this.prismaService.email.findUnique({
      where: { email: createEmailDto.email },
    });
    if (emailExists) {
      throw new BadRequestException(`Email allaqachon mavjud`);
    }

    const activation = uuidv4();
    await sendEmail(createEmailDto.email, activation);

    const createdEmail = await this.prismaService.email.create({
      data: {
        ...createEmailDto,
        user_id: userId,
        activation,
      },
    });

    if (!createdEmail) {
      throw new InternalServerErrorException(
        'Email yaratishda xatolik yuz berdi',
      );
    }

    return { message: 'Emailga tasdiqlash xabari yuborildi' };
  }

  async findAll(user: UserType | AdminType) {
    return this.prismaService.email.findMany({
      where:
        user.role === 'ADMIN' ? { user_id: user.id } : { user_id: user.id },
      select: {
        id: true,
        email: true,
        is_active: true,
      },
    });
  }

  async findOne(id: number, user: UserType | AdminType) {
    const email = await this.prismaService.email.findUnique({
      where: user.role === 'ADMIN' ? { id } : { id, user_id: user.id },
      select: {
        id: true,
        email: true,
        is_active: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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

    const activation = uuidv4();
    await sendEmail(updateEmailDto.email!, activation);

    await this.prismaService.email.update({
      where: { id },
      data: {
        ...updateEmailDto,
        activation,
        is_active: false,
      },
    });

    return { message: 'Emailga tasdiqlash xabari yuborildi' };
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

  async verifyEmail(uuid: string) {
    const email = await this.prismaService.email.findFirst({
      where: { activation: uuid },
    });
    if (!email) {
      throw new NotFoundException("Noto'g'ri link");
    }
    if (email.is_active) {
      return { message: 'Email avval aktivlashtirilgan' };
    }

    await this.prismaService.email.update({
      where: { id: email.id },
      data: { is_active: true },
    });

    return { message: 'Email aktivlashtirildi' };
  }
}
