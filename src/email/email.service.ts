import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateEmailDto } from "./dto/create-email.dto";
import { UpdateEmailDto } from "./dto/update-email.dto";
import { PrismaService } from "../prisma/prisma.service"; // Adjust path if needed
import { Email, Prisma, User } from "@prisma/client"; // Import Prisma types

@Injectable()
export class EmailService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEmailDto: CreateEmailDto): Promise<Email> {
    try {
      // Foydalanuvchi mavjudligini tekshirish
      const user: User | null = await this.prismaService.user.findUnique({
        where: { id: createEmailDto.user_id },
      });
      if (!user) {
        throw new BadRequestException(
          `IDsi ${createEmailDto.user_id} bo'lgan foydalanuvchi topilmadi.`
        );
      }

      const newEmail = await this.prismaService.email.create({
        data: createEmailDto,
      });
      return newEmail;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unikal cheklov buzilishi (email takrorlangan)
        if (error.code === "P2002") {
          const target = error.meta?.target;
          if (Array.isArray(target) && target.includes("email")) { // <-- TO'G'RILANDI
            throw new BadRequestException(
              `'${createEmailDto.email}' elektron pochtasi allaqachon mavjud.`
            );
          }
        }
        // P2003: Tashqi kalit cheklovi buzilishi (user_id mavjud emas)
        if (error.code === "P2003") {
          const fieldName = error.meta?.field_name;
          if (typeof fieldName === 'string' && fieldName.toLowerCase().includes("user_id")) { // <-- TO'G'RILANDI
            throw new BadRequestException(
              `IDsi '${createEmailDto.user_id}' bo'lgan foydalanuvchi mavjud emas.`
            );
          }
        }
      }
      console.error("Elektron pochta yaratishda xatolik:", error);
      throw new InternalServerErrorException("Elektron pochtani yaratib bo'lmadi.");
    }
  }

  async findAll(): Promise<Email[]> {
    return this.prismaService.email.findMany({
      include: { user: true }, // Agar kerak bo'lsa, bog'liq user ma'lumotlarini qo'shish
    });
  }

  async findOne(id: number): Promise<Email> {
    const email = await this.prismaService.email.findUnique({
      where: { id },
      include: { user: true }, // Agar kerak bo'lsa, bog'liq user ma'lumotlarini qo'shish
    });
    if (!email) {
      throw new NotFoundException(`IDsi ${id} bo'lgan elektron pochta topilmadi.`);
    }
    return email;
  }

  async update(
    id: number,
    updateEmailDto: UpdateEmailDto
  ): Promise<Email> {
    // Avval elektron pochta mavjudligini tekshirish
    await this.findOne(id); // Agar topilmasa, NotFoundException tashlaydi

    // Agar user_id yangilanayotgan bo'lsa, yangi user_id mavjudligini tekshirish
    if (updateEmailDto.user_id) {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: updateEmailDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `Yangilash uchun IDsi ${updateEmailDto.user_id} bo'lgan foydalanuvchi topilmadi.`
        );
      }
    }

    try {
      const updatedEmail = await this.prismaService.email.update({
        where: { id },
        data: updateEmailDto,
      });
      return updatedEmail;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unikal cheklov buzilishi (email takrorlangan)
        if (error.code === "P2002") {
          const target = error.meta?.target;
          if (Array.isArray(target) && target.includes("email") && updateEmailDto.email) { // <-- TO'G'RILANDI
            throw new BadRequestException(
              `'${updateEmailDto.email}' elektron pochtasi allaqachon mavjud.`
            );
          }
        }
        // P2003: Tashqi kalit cheklovi buzilishi (user_id mavjud emas)
        if (error.code === "P2003") {
            const fieldName = error.meta?.field_name;
            if (typeof fieldName === 'string' && fieldName.toLowerCase().includes("user_id") && updateEmailDto.user_id) { // <-- TO'G'RILANDI
                throw new BadRequestException(
                  `Yangilash uchun IDsi '${updateEmailDto.user_id}' bo'lgan foydalanuvchi mavjud emas.`
                );
            }
        }
        // P2025: Yangilanadigan yozuv topilmadi (findOne buni ushlashi kerak, lekin qo'shimcha himoya)
        if (error.code === "P2025") {
            throw new NotFoundException(`Yangilash uchun IDsi ${id} bo'lgan elektron pochta topilmadi.`);
        }
      }
      console.error(`IDsi ${id} bo'lgan elektron pochtani yangilashda xatolik:`, error);
      throw new InternalServerErrorException("Elektron pochtani yangilab bo'lmadi.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    // Avval elektron pochta mavjudligini tekshirish
    await this.findOne(id); // Agar topilmasa, NotFoundException tashlaydi

    try {
      await this.prismaService.email.delete({
        where: { id },
      });
      return { message: `IDsi ${id} bo'lgan elektron pochta muvaffaqiyatli o'chirildi.` };
    } catch (error) {
       if (error instanceof NotFoundException) { // findOne tomonidan ushlanishi kerak
          throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: O'chiriladigan yozuv topilmadi (findOne buni ushlashi kerak, lekin qo'shimcha himoya)
        if (error.code === "P2025") {
            throw new NotFoundException(`O'chirish uchun IDsi ${id} bo'lgan elektron pochta topilmadi.`);
        }
      }
      console.error(`IDsi ${id} bo'lgan elektron pochtani o'chirishda xatolik:`, error);
      throw new InternalServerErrorException("Elektron pochtani o'chirib bo'lmadi.");
    }
  }
}