import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FileAmazonService } from '../file-amazon/file-amazon.service';
import * as bcrypt from 'bcrypt';
import { Admin, Prisma } from '@prisma/client';
import { phoneChecker } from '../common/phone';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';

type AdminPublicData = Omit<Admin, 'password' | 'refresh_token'>;
type SelectedAdminDataForPasswordUpdate = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  avatar: string | null;
};
@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileAmazonService: FileAmazonService,
  ) {}

  async create(
    createAdminDto: CreateAdminDto,
    image?: Express.Multer.File,
  ): Promise<AdminPublicData> {
    if (!phoneChecker(createAdminDto.phone)) {
      throw new BadRequestException("Telefon raqam noto'g'ri.");
    }

    try {
      let fileUrl: string | undefined = undefined;
      if (image) {
        fileUrl = await this.fileAmazonService.uploadFile(image);
      }

      const password_hash = await bcrypt.hash(createAdminDto.password, 7);

      const newAdminData: Prisma.AdminCreateInput = {
        name: createAdminDto.name,
        surname: createAdminDto.surname,
        birth_date: new Date(createAdminDto.birth_date),
        phone: createAdminDto.phone,
        password: password_hash,
        refresh_token: '',
      };

      if (fileUrl) {
        newAdminData.avatar = fileUrl;
      }

      const newAdmin = await this.prismaService.admin.create({
        data: newAdminData,
      });

      const { password, refresh_token, ...result } = newAdmin;
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target && target.includes('phone')) {
            throw new ConflictException(
              `Telefon raqami ${createAdminDto.phone} allaqachon band.`,
            );
          }
        }
      }
      console.error('Admin yaratishda xatolik:', error);
      throw new InternalServerErrorException(
        'Admin yaratishda kutilmagan xatolik yuz berdi.',
      );
    }
  }

  findAdminByPhone(phone: string): Promise<Admin | null> {
    if (!phoneChecker(phone)) {
      throw new BadRequestException("Telefon raqam noto'g'ri.");
    }
    return this.prismaService.admin.findUnique({
      where: { phone },
      include: { blocks_issued: true, products_managed: true },
    });
  }

  async findAll(): Promise<AdminPublicData[]> {
    const admins = await this.prismaService.admin.findMany({
      include: { blocks_issued: true, products_managed: true },
    });
    return admins.map((admin) => {
      const { password, refresh_token, ...result } = admin;
      return result;
    });
  }

  async findOne(id: number): Promise<AdminPublicData> {
    const admin = await this.prismaService.admin.findUnique({
      where: { id },
      include: { blocks_issued: true, products_managed: true },
    });
    if (!admin) {
      throw new NotFoundException(`Admin ID ${id} topilmadi.`);
    }
    const { password, refresh_token, ...result } = admin;
    return result;
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
    user: AdminType,
    avatarFile?: Express.Multer.File,
  ) {
    const existingAdmin = await this.prismaService.admin.findUnique({
      where: { id },
    });
    if (!existingAdmin)
      throw new NotFoundException(`Admin ID ${id} topilmadi.`);

    const dataToUpdate: any = {};

    if (updateAdminDto.name) dataToUpdate.name = updateAdminDto.name;
    if (updateAdminDto.surname) dataToUpdate.surname = updateAdminDto.surname;
    if (updateAdminDto.birth_date)
      dataToUpdate.birth_date = new Date(updateAdminDto.birth_date);

    if (updateAdminDto.phone && updateAdminDto.phone !== existingAdmin.phone) {
      if (!phoneChecker(updateAdminDto.phone))
        throw new BadRequestException("Telefon raqam noto'g'ri.");
      const adminWithNewPhone = await this.prismaService.admin.findUnique({
        where: { phone: updateAdminDto.phone },
      });
      if (adminWithNewPhone && adminWithNewPhone.id !== id) {
        throw new ConflictException(
          `Telefon raqami ${updateAdminDto.phone} allaqachon mavjud.`,
        );
      }
      dataToUpdate.phone = updateAdminDto.phone;
    }

    if (avatarFile) {
      dataToUpdate.avatar = await this.fileAmazonService.uploadFile(avatarFile);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new BadRequestException(
        "Yangilash uchun hech qanday ma'lumot yuborilmadi.",
      );
    }

    const updatedAdmin = await this.prismaService.admin.update({
      where: { id },
      data: dataToUpdate,
    });

    const { password, refresh_token, ...result } = updatedAdmin;
    return result;
  }

  async remove(id: number, user: AdminType): Promise<void> {
    const admin = await this.prismaService.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin ID ${id} topilmadi.`);
    }
    try {
      await this.prismaService.admin.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Admin ID ${id} ni o'chirishda xatolik:`, error);
      throw new InternalServerErrorException(
        `Admin ID ${id} ni o'chirishda kutilmagan xatolik yuz berdi.`,
      );
    }
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
    user: AdminType,
  ): Promise<{ message: string; data: SelectedAdminDataForPasswordUpdate }> {
    try {
      const admin = await this.prismaService.admin.findUnique({
        where: { id },
      });

      if (!admin) {
        throw new NotFoundException(`Admin ID ${id} topilmadi.`);
      }

      const isPasswordValid = await bcrypt.compare(
        updatePasswordDto.oldPassword,
        admin.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException("Eski parol noto'g'ri.");
      }

      if (
        updatePasswordDto.newPassword !== updatePasswordDto.confirmNewPassword
      ) {
        throw new BadRequestException('Yangi parollar mos kelmaydi.');
      }

      const isSameAsOld = await bcrypt.compare(
        updatePasswordDto.newPassword,
        admin.password,
      );
      if (isSameAsOld) {
        throw new BadRequestException(
          "Yangi parol eski paroldan farqli bo'lishi kerak.",
        );
      }

      const hashedPassword = await bcrypt.hash(
        updatePasswordDto.newPassword,
        7,
      );

      const updatedAdmin = await this.prismaService.admin.update({
        where: { id },
        data: { password: hashedPassword },
        select: {
          id: true,
          name: true,
          surname: true,
          phone: true,
          avatar: true,
        },
      });

      return {
        message: 'Parol muvaffaqiyatli yangilandi.',
        data: updatedAdmin,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Admin ID ${id} parolini yangilashda xatolik:`, error);
      throw new InternalServerErrorException(
        'Parolni yangilashda kutilmagan xatolik yuz berdi.',
      );
    }
  }
}
