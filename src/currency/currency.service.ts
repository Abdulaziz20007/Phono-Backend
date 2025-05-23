import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrencyService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const existing = await this.prismaService.currency.findUnique({
      where: { name: createCurrencyDto.name },
    });
    if (existing) {
      throw new BadRequestException(
        `Ushbu nomdagi valyuta ('${createCurrencyDto.name}') allaqachon mavjud.`,
      );
    }
    return this.prismaService.currency.create({
      data: createCurrencyDto,
    });
  }

  async findAll() {
    return this.prismaService.currency.findMany();
  }

  async findOne(id: number) {
    const currency = await this.prismaService.currency.findUnique({
      where: { id },
    });
    if (!currency) {
      throw new NotFoundException(`IDsi ${id} bo'lgan valyuta topilmadi.`);
    }
    return currency;
  }

  async update(id: number, updateCurrencyDto: any) {
    const existing = await this.prismaService.currency.findUnique({
      where: { name: updateCurrencyDto.name },
    });
    if (existing) {
      throw new BadRequestException(
        `Ushbu nomdagi valyuta ('${updateCurrencyDto.name}') allaqachon mavjud.`,
      );
    }
    return this.prismaService.currency.update({
      where: { id },
      data: updateCurrencyDto,
    });
  }

  async remove(id: number) {
    const existing = await this.prismaService.currency.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Ushbu valyuta topilmadi');
    }
    await this.prismaService.currency.delete({
      where: { id },
    });
    return { message: `IDsi ${id} bo'lgan valyuta muvaffaqiyatli o'chirildi.` };
  }
}
