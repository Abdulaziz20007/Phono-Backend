import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdatePasswordDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '../common/types/user.type';
import * as bcrypt from 'bcrypt';

// Agar Prisma schemangizda FavouriteItem uchun model mavjud bo'lsa (odatda FavouriteItem deb nomlanadi),
// uni @prisma/client dan import qilishingiz mumkin:
// import { FavouriteItem as PrismaFavouriteItem } from '@prisma/client';
// Agar yo'q bo'lsa yoki boshqacha nomlangan bo'lsa, quyidagi interfeysdan foydalaning.
// Bu sizning `favourite_items` massividagi har bir obyektning tuzilishiga mos kelishi kerak.
export interface FavouriteItemType {
  // Tip nomini Prisma tipi bilan chalkashmasligi uchun o'zgartirdim
  id: number;
  product_id: number;
  user_id: number;
  // Agar favourite_items modelingizda boshqa maydonlar bo'lsa, ularni shu yerga qo'shing
  // Masalan: createdAt?: Date; updatedAt?: Date; product?: any; // Agar productni ham include qilsangiz
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const { phone, password, name, surname } = createUserDto;
    return this.prisma.user.create({
      data: {
        phone,
        password, // Bu yerda passwordni hash qilish kerak edi, lekin hozirgi talab bu emas
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

  async favouriteItem(user: UserType) {
    console.log('Fetching favourite products for user:', user.id);

    // 1. Foydalanuvchining user_id siga teng bo'lgan FavouriteItem yozuvlarini topamiz.
    // 2. Har bir FavouriteItem yozuvi bilan bog'liq bo'lgan Product ma'lumotlarini ham yuklaymiz (include).
    const favouriteEntries = await this.prisma.favouriteItem.findMany({
      // Model nomini to'g'ri yozing (masalan, favouriteItem yoki FavouriteItem)
      where: {
        user_id: user.id,
      },
      include: {
        product: {
          // Bu yerda "product" - FavouriteItem modelidagi Product ga bo'lgan relation nomi
          include: {
            // Agar mahsulotning rasmlarini ham olish kerak bo'lsa
            images: true, // "images" - Product modelidagi Image ga bo'lgan relation nomi
          },
        },
      },
    });

    if (!favouriteEntries || favouriteEntries.length === 0) {
      return []; // Agar sevimlilar bo'lmasa, bo'sh massiv qaytaramiz
    }

    // 3. Natijadan faqat Product obyektlarini ajratib olamiz.
    //    Agar `product` null bo'lishi mumkin bo'lsa (masalan, ma'lumotlar bazasida nomuvofiqlik bo'lsa),
    //    ularni filterlab o'tkazib yuboramiz.
    const favouriteProducts = favouriteEntries
      .map((entry) => entry.product)
      .filter((product) => product !== null && product !== undefined);

    return favouriteProducts;
  }

  async me(user: UserType) {
    console.log('User object received in me service:', user);
    const theUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        addresses: true,
        additional_phones: true,
        emails: {
          select: {
            id: true,
            user_id: true,
            email: true,
            is_active: true,
          },
        },
        favourite_items: true,
        payments: true,
        products: {
          include: {
            images: true,
          },
        },
        comments: true,
        blocks: true,
        otps: true, // `otps` ni olib tashlashimiz kerak, chunki u ...rest bilan qaytarilmayapti
      },
    });
    if (!theUser) {
      throw new NotFoundException('User topilmadi');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refresh_token, otps, ...rest } = theUser; // otps ni ...rest dan oldin olib tashladik
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updateUserDto; // passwordni update qilmaymiz bu yerda
    return this.prisma.user.update({
      where: { id },
      data: rest,
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

  updateRefreshToken(id: number, refreshToken: string) {
    return this.prisma.user.update({
      where: { id },
      data: { refresh_token: refreshToken },
    });
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Joriy parol noto'g'ri");
    }

    const hashedPassword = await bcrypt.hash(
      updatePasswordDto.new_password,
      10, // Salt rounds
    );
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return { message: "Parol muvaffaqiyatli o'zgartirildi" };
  }

  async remove(id: number) {
    // Bog'liq ma'lumotlarni o'chirish yoki aloqani uzish kerak bo'lishi mumkin
    // Masalan, favourite_items, products, comments va hokazo.
    // Bu Prisma schemangizdagi cascade qoidalariga bog'liq.
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
