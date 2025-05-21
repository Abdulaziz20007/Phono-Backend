import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { PrismaService } from "../prisma/prisma.service"; // Yo'lni moslang
import { Address, Prisma, User } from "@prisma/client"; // Prisma turlarini import qilish

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    try {
      const { user_id, is_active, ...restData } = createAddressDto;

      // Foydalanuvchi mavjudligini tekshirish
      const user: User | null = await this.prismaService.user.findUnique({
        where: { id: user_id },
      });
      if (!user) {
        throw new BadRequestException(
          `IDsi ${user_id} bo'lgan foydalanuvchi topilmadi.`
        );
      }

      const newAddress = await this.prismaService.address.create({
        data: {
          ...restData,
          user_id: user_id,
          is_active: is_active === undefined ? true : is_active, // Agar is_active kelmasa, default true
        },
      });
      return newAddress;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Tashqi kalit cheklovi buzilishi (user_id mavjud emas)
        if (error.code === "P2003") {
          const fieldName = error.meta?.field_name;
          if (typeof fieldName === 'string' && fieldName.toLowerCase().includes("user_id")) {
            throw new BadRequestException(
              `IDsi '${createAddressDto.user_id}' bo'lgan foydalanuvchi mavjud emas.`
            );
          }
        }
      }
      console.error("Manzil yaratishda xatolik:", error);
      throw new InternalServerErrorException("Manzilni yaratib bo'lmadi.");
    }
  }

  async findAll(userId?: number): Promise<Address[]> {
    const whereClause: Prisma.AddressWhereInput = {};
    if (userId) {
      whereClause.user_id = userId;
    }
    return this.prismaService.address.findMany({
      where: whereClause,
      include: { user: true }, // Bog'liq user ma'lumotlarini qo'shish
    });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.prismaService.address.findUnique({
      where: { id },
      include: { user: true }, // Bog'liq user ma'lumotlarini qo'shish
    });
    if (!address) {
      throw new NotFoundException(`IDsi ${id} bo'lgan manzil topilmadi.`);
    }
    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto
  ): Promise<Address> {
    await this.findOne(id); // Mavjudligini tekshirish

    if (updateAddressDto.user_id) {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: updateAddressDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `Yangilash uchun IDsi ${updateAddressDto.user_id} bo'lgan foydalanuvchi topilmadi.`
        );
      }
    }

    try {
      const updatedAddress = await this.prismaService.address.update({
        where: { id },
        data: updateAddressDto,
      });
      return updatedAddress;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
            const fieldName = error.meta?.field_name;
            if (typeof fieldName === 'string' && fieldName.toLowerCase().includes("user_id") && updateAddressDto.user_id) {
                throw new BadRequestException(
                  `Yangilash uchun IDsi '${updateAddressDto.user_id}' bo'lgan foydalanuvchi mavjud emas.`
                );
            }
        }
        if (error.code === "P2025") {
            throw new NotFoundException(`Yangilash uchun IDsi ${id} bo'lgan manzil topilmadi.`);
        }
      }
      console.error(`IDsi ${id} bo'lgan manzilni yangilashda xatolik:`, error);
      throw new InternalServerErrorException("Manzilni yangilab bo'lmadi.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id); // Mavjudligini tekshirish

    try {
      await this.prismaService.address.delete({
        where: { id },
      });
      return { message: `IDsi ${id} bo'lgan manzil muvaffaqiyatli o'chirildi.` };
    } catch (error) {
       if (error instanceof NotFoundException) {
          throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            throw new NotFoundException(`O'chirish uchun IDsi ${id} bo'lgan manzil topilmadi.`);
        }
        // Agar Manzil Product jadvalida ishlatilayotgan bo'lsa
        if (error.code === "P2003") {
             throw new BadRequestException(
                `IDsi ${id} bo'lgan manzilni o'chirib bo'lmaydi, chunki u boshqa yozuvlar (masalan, mahsulotlar) bilan bog'langan.`
             );
        }
      }
      console.error(`IDsi ${id} bo'lgan manzilni o'chirishda xatolik:`, error);
      throw new InternalServerErrorException("Manzilni o'chirib bo'lmadi.");
    }
  }

  async setActive(userId: number, addressId: number): Promise<Address> {
    // Avval foydalanuvchining boshqa manzillarini nofaol qilish
    await this.prismaService.address.updateMany({
      where: {
        user_id: userId,
        is_active: true,
        NOT: { id: addressId }, // Joriy manzilni hisobga olmaslik
      },
      data: { is_active: false },
    });

    // Keyin tanlangan manzilni aktiv qilish
    const activeAddress = await this.prismaService.address.update({
      where: { id: addressId, user_id: userId }, // Faqat shu userga tegishli manzilni
      data: { is_active: true },
    });
    if (!activeAddress) {
        throw new NotFoundException(`IDsi ${addressId} va foydalanuvchi IDsi ${userId} bo'lgan manzil topilmadi yoki yangilanmadi.`);
    }
    return activeAddress;
  }
}