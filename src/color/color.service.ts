import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Color } from '@prisma/client';
import { CreateColorDto, UpdateColorDto } from './dto';

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    const existing = await this.prismaService.color.findUnique({
      where: { name: createColorDto.name },
    });
    if (existing) {
      throw new BadRequestException(
        `Ushbu nomdagi rang ('${createColorDto.name}') allaqachon mavjud.`,
      );
    }
    return this.prismaService.color.create({
      data: createColorDto,
    });
  }

  async findAll(): Promise<Color[]> {
    return this.prismaService.color.findMany();
  }

  async findOne(id: number): Promise<Color> {
    const color = await this.prismaService.color.findUnique({
      where: { id },
    });
    if (!color) {
      throw new NotFoundException(`IDsi ${id} bo'lgan rang topilmadi.`);
    }
    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto): Promise<Color> {
    const existing = await this.prismaService.color.findUnique({
      where: { id: id },
    });
    if (!existing) {
      throw new NotFoundException(`Ushbu rang topilmadi`);
    }
    const existingColor = await this.prismaService.color.findUnique({
      where: { name: updateColorDto.name },
    });
    if (existingColor) {
      throw new BadRequestException('Ushbu rang avval mavjud');
    }
    return this.prismaService.color.update({
      where: { id },
      data: updateColorDto,
    });
  }

  async remove(id: number) {
    const existing = await this.prismaService.color.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Ushbu rang topilmadi`);
    }
    const message = await this.prismaService.color.delete({
      where: { id },
      
    });
     console.log(1, message);
    return message
  }
}
