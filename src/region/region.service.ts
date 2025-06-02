import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    const existing = await this.prismaService.region.findUnique({
      where: { name: createRegionDto.name },
    });
    if (existing) {
      throw new BadRequestException(
        `Ushbu nomdagi mintaqa ('${createRegionDto.name}') allaqachon mavjud.`,
      );
    }
    return this.prismaService.region.create({
      data: createRegionDto,
    });
  }

  async bulkCreate(createRegionDto: CreateRegionDto[]) {
    const existing = await this.prismaService.region.findMany({
      where: { name: { in: createRegionDto.map((item) => item.name) } },
    });
    if (existing.length > 0) {
      throw new BadRequestException(
        `Ushbu nomdagi mintaqa allaqachon mavjud: ${existing.map((item) => item.name).join(', ')}`,
      );
    } else {
      return this.prismaService.region.createMany({
        data: createRegionDto,
      });
    }
  }

  async findAll() {
    return this.prismaService.region.findMany();
  }

  async findOne(id: number) {
    const region = await this.prismaService.region.findUnique({
      where: { id },
    });
    if (!region) {
      throw new NotFoundException(`IDsi ${id} bo'lgan mintaqa topilmadi.`);
    }
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const existing = await this.prismaService.region.findUnique({
      where: { id: id },
    });
    if (!existing) {
      throw new NotFoundException(`Ushbu mintaqa topilmadi`);
    }

    if (updateRegionDto.name) {
      const existingRegion = await this.prismaService.region.findUnique({
        where: { name: updateRegionDto.name },
      });

      if (existingRegion && existingRegion.id !== id) {
        throw new BadRequestException('Ushbu nomdagi mintaqa avval mavjud');
      }
    }

    return this.prismaService.region.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: number) {
    const existing = await this.prismaService.region.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Ushbu mintaqa topilmadi`);
    }

    if (existing.addresses.length > 0) {
      throw new BadRequestException(
        `Ushbu mintaqani o'chirib bo'lmaydi. U ${existing.addresses.length} ta manzil bilan bog'langan`,
      );
    }

    return this.prismaService.region.delete({
      where: { id },
    });
  }
}
