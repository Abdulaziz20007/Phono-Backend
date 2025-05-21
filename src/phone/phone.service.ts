import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePhoneDto } from "./dto/create-phone.dto";
import { UpdatePhoneDto } from "./dto/update-phone.dto";
import { PrismaService } from "../prisma/prisma.service"; // Yo'lni moslang
import { Phone, Prisma, User } from "@prisma/client"; // Prisma turlarini import qilish

@Injectable()
export class PhoneService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPhoneDto: CreatePhoneDto): Promise<Phone> {
    try {
      // Foydalanuvchi mavjudligini tekshirish
      const user: User | null = await this.prismaService.user.findUnique({
        where: { id: createPhoneDto.user_id },
      });
      if (!user) {
        throw new BadRequestException(
          `IDsi ${createPhoneDto.user_id} bo'lgan foydalanuvchi topilmadi.`
        );
      }

      // Agar kerak bo'lsa: shu foydalanuvchi uchun bu raqam allaqachon mavjudligini tekshirish
      // const existingPhoneForUser = await this.prismaService.phone.findFirst({
      //   where: {
      //     phone: createPhoneDto.phone,
      //     user_id: createPhoneDto.user_id,
      //   },
      // });
      // if (existingPhoneForUser) {
      //   throw new BadRequestException(
      //     `Bu telefon raqami ('${createPhoneDto.phone}') bu foydalanuvchi uchun allaqachon mavjud.`
      //   );
      // }

      const newPhone = await this.prismaService.phone.create({
        data: createPhoneDto,
      });
      return newPhone;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unikal cheklov buzilishi (agar 'phone' global unikal bo'lsa yoki (phone, user_id) birgalikda unikal bo'lsa)
        // Hozirgi modelda 'phone' da @unique yo'q, shuning uchun bu xato faqat @@unique bilan kelishi mumkin.
        if (error.code === "P2002") {
            const target = error.meta?.target;
            if (Array.isArray(target) && target.includes("phone")) {
                 throw new BadRequestException(
                    `Telefon raqami '${createPhoneDto.phone}' allaqachon mavjud.`
                 );
            }
        }
        // P2003: Tashqi kalit cheklovi buzilishi (user_id mavjud emas)
        if (error.code === "P2003") {
          const fieldName = error.meta?.field_name;
          if (typeof fieldName === 'string' && fieldName.toLowerCase().includes("user_id")) {
            throw new BadRequestException(
              `IDsi '${createPhoneDto.user_id}' bo'lgan foydalanuvchi mavjud emas.`
            );
          }
        }
      }
      console.error("Telefon raqami yaratishda xatolik:", error);
      throw new InternalServerErrorException("Telefon raqamini yaratib bo'lmadi.");
    }
  }

  async findAll(): Promise<Phone[]> {
    return this.prismaService.phone.findMany({
      include: { user: true }, // Bog'liq user ma'lumotlarini qo'shish
    });
  }

  async findOne(id: number): Promise<Phone> {
    const phone = await this.prismaService.phone.findUnique({
      where: { id },
      include: { user: true }, // Bog'liq user ma'lumotlarini qo'shish
    });
    if (!phone) {
      throw new NotFoundException(`IDsi ${id} bo'lgan telefon raqami topilmadi.`);
    }
    return phone;
  }

  async update(
    id: number,
    updatePhoneDto: UpdatePhoneDto
  ): Promise<Phone> {
    await this.findOne(id); // Mavjudligini tekshirish

    if (updatePhoneDto.user_id) {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: updatePhoneDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `Yangilash uchun IDsi ${updatePhoneDto.user_id} bo'lgan foydalanuvchi topilmadi.`
        );
      }
    }

    try {
      const updatedPhone = await this.prismaService.phone.update({
        where: { id },
        data: updatePhoneDto,
      });
      return updatedPhone;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") { // Agar phone unique bo'lsa
            const target = error.meta?.target;
            if (Array.isArray(target) && target.includes("phone") && updatePhoneDto.phone) {
                 throw new BadRequestException(
                    `Telefon raqami '${updatePhoneDto.phone}' allaqachon mavjud.`
                 );
            }
        }
        if (error.code === "P2003") {
            const fieldName = error.meta?.field_name;
            if (typeof fieldName === 'string' && fieldName.toLowerCase().includes("user_id") && updatePhoneDto.user_id) {
                throw new BadRequestException(
                  `Yangilash uchun IDsi '${updatePhoneDto.user_id}' bo'lgan foydalanuvchi mavjud emas.`
                );
            }
        }
        if (error.code === "P2025") {
            throw new NotFoundException(`Yangilash uchun IDsi ${id} bo'lgan telefon raqami topilmadi.`);
        }
      }
      console.error(`IDsi ${id} bo'lgan telefon raqamini yangilashda xatolik:`, error);
      throw new InternalServerErrorException("Telefon raqamini yangilab bo'lmadi.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id); // Mavjudligini tekshirish

    try {
      await this.prismaService.phone.delete({
        where: { id },
      });
      return { message: `IDsi ${id} bo'lgan telefon raqami muvaffaqiyatli o'chirildi.` };
    } catch (error) {
       if (error instanceof NotFoundException) {
          throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            throw new NotFoundException(`O'chirish uchun IDsi ${id} bo'lgan telefon raqami topilmadi.`);
        }
        // Agar Phone Product jadvalida ishlatilayotgan bo'lsa va o'chirishga to'sqinlik qilsa
        if (error.code === "P2003") {
             throw new BadRequestException(
                `IDsi ${id} bo'lgan telefon raqamini o'chirib bo'lmaydi, chunki u boshqa yozuvlar (masalan, mahsulotlar) bilan bog'langan.`
             );
        }
      }
      console.error(`IDsi ${id} bo'lgan telefon raqamini o'chirishda xatolik:`, error);
      throw new InternalServerErrorException("Telefon raqamini o'chirib bo'lmadi.");
    }
  }
}