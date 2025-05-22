import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FileAmazonService } from '../file-amazon/file-amazon.service';
import { Brand, Prisma } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileAmazonService: FileAmazonService,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    logoFile: Express.Multer.File,
  ): Promise<Brand> {
    if (!logoFile) {
      // Bu controllerda allaqachon tekshirilgan, lekin xavfsizlik uchun qoldiramiz
      throw new BadRequestException('Brand logotipi yuklanishi shart!');
    }

    try {
      // FileAmazonService.uploadFile ning return type i string | undefined deb hisoblaymiz
      const imageUrl: string | undefined =
        await this.fileAmazonService.uploadFile(logoFile);

      // Agar uploadFile undefined qaytarsa, bu kutilmagan holat, chunki logoFile majburiy
      if (imageUrl === undefined) {
        console.error(
          'FileAmazonService.uploadFile returned undefined for a mandatory logo.',
        );
        throw new InternalServerErrorException(
          'Fayl S3 ga yuklandi, lekin URL manzili olinmadi.',
        );
      }

      const brand = await this.prismaService.brand.create({
        data: {
          name: createBrandDto.name,
          logo: imageUrl, // Bu yerda imageUrl string bo'lishi kafolatlangan (yuqoridagi if tufayli)
        },
      });
      return brand;
    } catch (error) {
      console.error('Error while creating brand:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target && target.includes('name')) {
            throw new ConflictException(
              `'${createBrandDto.name}' nomli brand allaqachon mavjud.`,
            );
          }
        }
      }
      // Agar xatolik allaqachon biz kutgan turlardan biri bo'lsa, uni qayta tashlaymiz
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      // Aks holda, umumiy InternalServerErrorException
      throw new InternalServerErrorException(
        (error as Error).message ||
          "Brand yaratishda noma'lum xatolik yuz berdi.",
      );
    }
  }

  // ... qolgan methodlar (findAll, findOne, update, remove) avvalgidek ...
  // update methodida ham shunga o'xshash tekshiruvni newImageUrl uchun qilishingiz mumkin
  async findAll(): Promise<Brand[]> {
    return this.prismaService.brand.findMany({
      include: {
        models: true,
      },
    });
  }

  async findOne(id: number): Promise<Brand | null> {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
      include: {
        models: true,
      },
    });

    if (!brand) {
      throw new NotFoundException(`${id} ID'li brand topilmadi.`);
    }
    return brand;
  }

  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
    logoFile?: Express.Multer.File,
  ): Promise<Brand> {
    const existingBrand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      throw new NotFoundException(`${id} ID'li brand topilmadi.`);
    }

    if (Object.keys(updateBrandDto).length === 0 && !logoFile) {
      throw new BadRequestException(
        "Yangilash uchun hech bo'lmaganda bitta maydon yoki rasm yuboring.",
      );
    }

    const dataToUpdate: Prisma.BrandUpdateInput = {};

    if (updateBrandDto.name) {
      dataToUpdate.name = updateBrandDto.name;
    }

    try {
      if (logoFile) {
        if (existingBrand.logo) {
          console.warn(
            `Old brand logo ${existingBrand.logo} was not deleted from S3. Implement deletion if necessary.`,
          );
        }
        const newImageUrl: string | undefined =
          await this.fileAmazonService.uploadFile(logoFile);
        if (newImageUrl === undefined) {
          console.error(
            'FileAmazonService.uploadFile returned undefined for an optional logo during update.',
          );
          throw new InternalServerErrorException(
            'Fayl S3 ga yuklandi (yangilash), lekin URL manzili olinmadi.',
          );
        }
        dataToUpdate.logo = newImageUrl;
      }

      const updatedBrand = await this.prismaService.brand.update({
        where: { id },
        data: dataToUpdate,
      });

      return updatedBrand;
    } catch (error) {
      console.error('Error while updating brand:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target && target.includes('name') && updateBrandDto.name) {
            throw new ConflictException(
              `'${updateBrandDto.name}' nomli brand allaqachon mavjud.`,
            );
          }
        }
      }
      throw new InternalServerErrorException(
        (error as Error).message ||
          "Brandni yangilashda noma'lum xatolik yuz berdi.",
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const existingBrand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      throw new NotFoundException(`${id} ID'li brand topilmadi.`);
    }

    try {
      await this.prismaService.brand.delete({ where: { id } });
      return { message: `${id} ID'li brand muvaffaqiyatli o'chirildi.` };
    } catch (error) {
      console.error('Error while deleting brand:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            `${id} ID'li brandni o'chirib bo'lmadi, chunki u boshqa yozuvlar (masalan, modellar yoki mahsulotlar) tomonidan ishlatilmoqda. Avval o'sha yozuvlarni o'chiring yoki yangilang.`,
          );
        }
      }
      throw new InternalServerErrorException(
        (error as Error).message ||
          "Brandni o'chirishda noma'lum xatolik yuz berdi.",
      );
    }
  }
}
