// src/favourite-item/favourite-item.service.ts
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateFavouriteItemDto } from "./dto/create-favourite-item.dto";
import { FavouriteItem, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service"; // PrismaService joylashuviga qarab o'zgartiring

@Injectable()
export class FavouriteItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createFavouriteItemDto: CreateFavouriteItemDto
  ): Promise<FavouriteItem> {
    try {
      // 1. Foydalanuvchi mavjudligini tekshirish
      const userExists = await this.prismaService.user.findUnique({
        where: { id: createFavouriteItemDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `IDsi ${createFavouriteItemDto.user_id} bo'lgan foydalanuvchi topilmadi.`
        );
      }

      // 2. Mahsulot mavjudligini tekshirish
      const productExists = await this.prismaService.product.findUnique({
        where: { id: createFavouriteItemDto.product_id },
      });
      if (!productExists) {
        throw new BadRequestException(
          `IDsi ${createFavouriteItemDto.product_id} bo'lgan mahsulot topilmadi.`
        );
      }

      // 3. Bu mahsulot shu foydalanuvchi uchun allaqachon sevimlilarda borligini tekshirish
      // Prisma schemadagi @@unique([user_id, product_id]) uchun Prisma avtomatik
      // `user_id_product_id` nomli kompozit kalit yaratadi.
      const existingFavourite = await this.prismaService.favouriteItem.findUnique({
        where: {
          user_id_product_id: {
            user_id: createFavouriteItemDto.user_id,
            product_id: createFavouriteItemDto.product_id,
          },
        },
      });

      if (existingFavourite) {
        throw new BadRequestException(
          "Bu mahsulot allaqachon sevimlilaringizda mavjud."
        );
      }

      // 4. Sevimli yozuvni yaratish
      const favouriteItem = await this.prismaService.favouriteItem.create({
        data: createFavouriteItemDto,
        include: {
          user: true, // Yaratilgan yozuv bilan birga foydalanuvchi ma'lumotini qaytarish
          product: {  // Yaratilgan yozuv bilan birga mahsulot ma'lumotini qaytarish
            include: {
              images: { // Mahsulotning asosiy rasmini olish (agar mavjud bo'lsa)
                where: { is_main: true },
                take: 1,
              },
              currency: true, // Mahsulot valyutasini olish
            }
          }
        },
      });
      return favouriteItem;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Tashqi kalit cheklovi buzildi (agar yuqoridagi tekshiruvlar o'tkazib yuborilsa)
        if (error.code === "P2003") {
          const field = error.meta?.field_name as string; // qaysi maydon xatolik berayotganini aniqlash
          if (field?.includes("user_id")) {
            throw new BadRequestException(
              `IDsi '${createFavouriteItemDto.user_id}' bo'lgan foydalanuvchi mavjud emas.`
            );
          }
          if (field?.includes("product_id")) {
            throw new BadRequestException(
              `IDsi '${createFavouriteItemDto.product_id}' bo'lgan mahsulot mavjud emas.`
            );
          }
          throw new BadRequestException(
            "Tashqi kalit cheklovi buzildi. Foydalanuvchi va mahsulot mavjudligiga ishonch hosil qiling."
          );
        }
        // P2002: Unikal cheklov buzildi (agar yuqoridagi `existingFavourite` tekshiruvi o'tkazib yuborilsa)
        // Bu holat `user_id_product_id` kompozit kaliti uchun
        if (error.code === "P2002") {
             throw new BadRequestException(
                "Bu mahsulot allaqachon sevimlilaringizga qo'shilgan (ma'lumotlar bazasi cheklovi)."
             );
        }
      }
      console.error("Sevimlilarga qo'shishda xatolik:", error);
      throw new InternalServerErrorException(
        "Sevimlilarga qo'shib bo'lmadi."
      );
    }
  }

  async findAllByUserId(userId: number): Promise<FavouriteItem[]> {
    // Foydalanuvchi mavjudligini tekshirish
    const userExists = await this.prismaService.user.findUnique({
        where: { id: userId },
    });
    if (!userExists) {
        throw new NotFoundException(`IDsi ${userId} bo'lgan foydalanuvchi topilmadi.`);
    }

    return this.prismaService.favouriteItem.findMany({
      where: { user_id: userId },
      orderBy: { id: 'desc' }, // Oxirgi qo'shilganlar birinchi bo'lib chiqishi uchun
      include: {
        product: { // Har bir sevimlilar yozuvi uchun mahsulot ma'lumotlarini ham qo'shish
          include: {
            images: { // Mahsulotning asosiy rasmini olish
              where: { is_main: true },
              take: 1,
            },
            currency: true, // Mahsulot valyutasini olish
            address: true,  // Mahsulot manzilini olish
          }
        }
      },
    });
  }

  async findOne(id: number): Promise<FavouriteItem> {
    const favouriteItem = await this.prismaService.favouriteItem.findUnique({
      where: { id },
      include: { user: true, product: true },
    });
    if (!favouriteItem) {
      throw new NotFoundException(`IDsi ${id} bo'lgan sevimlilar yozuvi topilmadi.`);
    }
    return favouriteItem;
  }

  async remove(id: number): Promise<{ message: string }> {
    // Avval yozuv mavjudligini tekshiramiz
    // `findOne` topilmasa `NotFoundException` tashlaydi
    await this.findOne(id);

    try {
      await this.prismaService.favouriteItem.delete({
        where: { id },
      });
      return { message: `IDsi ${id} bo'lgan sevimlilar yozuvi muvaffaqiyatli o'chirildi.` };
    } catch (error) {
      // `findOne` allaqachon NotFoundException ni hal qilgan bo'lishi kerak,
      // lekin P2025 xatolik kodi uchun qo'shimcha himoya
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") { // O'chiriladigan yozuv topilmadi
            throw new NotFoundException(`IDsi ${id} bo'lgan sevimlilar yozuvi o'chirish uchun topilmadi.`);
        }
      }
      console.error(`IDsi ${id} bo'lgan sevimlilar yozuvini o'chirishda xatolik:`, error);
      throw new InternalServerErrorException("Sevimlilar yozuvini o'chirib bo'lmadi.");
    }
  }

  // Mahsulot IDsi va Foydalanuvchi IDsi bo'yicha o'chirish uchun qo'shimcha metod
  async removeByProductIdAndUserId(productId: number, userId: number): Promise<{ message: string }> {
    // 1. Foydalanuvchi mavjudligini tekshirish
    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new BadRequestException(
        `IDsi ${userId} bo'lgan foydalanuvchi topilmadi.`
      );
    }

    // 2. Mahsulot mavjudligini tekshirish
    const productExists = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      throw new BadRequestException(
        `IDsi ${productId} bo'lgan mahsulot topilmadi.`
      );
    }

    // 3. Sevimli yozuvni topish
    const favouriteItem = await this.prismaService.favouriteItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    if (!favouriteItem) {
      throw new NotFoundException(
        `Foydalanuvchi (ID: ${userId}) uchun mahsulot (ID: ${productId}) sevimlilarda topilmadi.`
      );
    }

    // 4. Sevimli yozuvni o'chirish
    try {
      await this.prismaService.favouriteItem.delete({
        where: {
          id: favouriteItem.id, // Topilgan yozuvning IDsi bo'yicha o'chirish
        },
      });
      return { message: `Mahsulot (ID: ${productId}) foydalanuvchi (ID: ${userId}) sevimlilaridan muvaffaqiyatli o'chirildi.` };
    } catch (error) {
      console.error(`Sevimlilar yozuvini (user_id: ${userId}, product_id: ${productId}) o'chirishda xatolik:`, error);
      throw new InternalServerErrorException("Sevimlilar yozuvini o'chirib bo'lmadi.");
    }
  }
}