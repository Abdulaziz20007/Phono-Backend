import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateModelDto, UpdateModelDto } from './dto';
import { PrismaService } from '../prisma/prisma.service'; // O'zingizning PrismaService yo'lingizni ko'rsating
import { Model } from '@prisma/client';

@Injectable()
export class ModelService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createModelDto: CreateModelDto) {
    try {
      const brandExists = await this.prismaService.brand.findUnique({
        where: { id: createModelDto.brand_id },
      });
      if (!brandExists) {
        throw new BadRequestException(
          `Brand with ID ${createModelDto.brand_id} not found.`,
        );
      }

      const model = await this.prismaService.model.create({
        data: {
          name: createModelDto.name,
          brand_id: createModelDto.brand_id,
        },
        include: {
          brand: true,
        },
      });
      return model;
    } catch (error) {
      if (
        error.code === 'P2002' &&
        error.meta?.target?.includes('brand_id') &&
        error.meta?.target?.includes('name')
      ) {
        throw new BadRequestException(
          `Model with name '${createModelDto.name}' already exists for brand ID ${createModelDto.brand_id}.`,
        );
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating model:', error);
      throw new InternalServerErrorException('Could not create model.');
    }
  }

  async findAll(brandIdInput?: number) {
    // Parametr nomi o'zgartirildi va turi ixtiyoriy
    return this.prismaService.model.findMany({
      where: {
        brand_id: brandIdInput, // Agar brandIdInput undefined bo'lsa, Prisma bu shartni e'tiborsiz qoldiradi
      },
      include: {
        brand: true,
      },
    });
  }

  async findOne(id: number) {
    const model = await this.prismaService.model.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });
    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found.`);
    }
    return model;
  }

  async update(id: number, updateModelDto: UpdateModelDto) {
    try {
      const existingModel = await this.findOne(id); // Model mavjudligini tekshirish

      let brandIdToUse = existingModel.brand_id; // Joriy brand ID
      if (updateModelDto.brand_id !== undefined) {
        // Agar DTOda brand_id kelgan bo'lsa
        const brandExists = await this.prismaService.brand.findUnique({
          where: { id: updateModelDto.brand_id },
        });
        if (!brandExists) {
          throw new BadRequestException(
            `Brand with ID ${updateModelDto.brand_id} not found.`,
          );
        }
        brandIdToUse = updateModelDto.brand_id;
      }

      const dataToUpdate: { name?: string; brand_id?: number } = {};
      if (updateModelDto.name !== undefined) {
        dataToUpdate.name = updateModelDto.name;
      }
      if (updateModelDto.brand_id !== undefined) {
        dataToUpdate.brand_id = updateModelDto.brand_id;
      }

      const updatedModel = await this.prismaService.model.update({
        where: { id },
        data: dataToUpdate,
        include: {
          brand: true,
        },
      });
      return updatedModel;
    } catch (error) {
      if (
        error.code === 'P2002' &&
        error.meta?.target?.includes('brand_id') &&
        error.meta?.target?.includes('name')
      ) {
        const nameToCheck =
          updateModelDto.name || (await this.findOne(id)).name;
        const brandIdToCheck =
          updateModelDto.brand_id || (await this.findOne(id)).brand_id;
        throw new BadRequestException(
          `Model with name '${nameToCheck}' already exists for brand ID ${brandIdToCheck}.`,
        );
      }
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Error updating model with ID ${id}:`, error);
      throw new InternalServerErrorException('Could not update model.');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.model.delete({
        where: { id },
      });
      return { message: `Model with ID ${id} deleted successfully.` };
    } catch (error) {
      console.error(`Error deleting model with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          `Cannot delete model with ID ${id} as it is still referenced by other records (e.g., Products).`,
        );
      }
      throw new InternalServerErrorException('Could not delete model.');
    }
  }
}
