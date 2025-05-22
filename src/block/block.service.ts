import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBlockDto: CreateBlockDto) {
    const { user_id, admin_id, reason, expire_date } = createBlockDto;

    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${user_id} not found`);
      }

      // Check if admin exists
      const admin = await this.prisma.admin.findUnique({
        where: { id: admin_id },
      });
      if (!admin) {
        throw new NotFoundException(`Admin with id ${admin_id} not found`);
      }

      // Create new block
      const newBlock = await this.prisma.block.create({
        data: {
          user_id,
          admin_id,
          reason,
          expire_date: expire_date,
        },
        include: {
          user: true,
          admin: true,
        },
      });

      return newBlock;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create block: ' + error.message);
    }
  }

  async findAll(user: UserType | AdminType) {
    try {
      return await this.prisma.block.findMany({
        where:
          user.role === 'ADMIN' || user.role === 'SUPERADMIN'
            ? { admin_id: user.id }
            : { user_id: user.id },
        include: {
          user: true,
          admin: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch blocks: ' + error.message);
    }
  }

  async findOne(id: number, user: UserType | AdminType) {
    try {
      const block = await this.prisma.block.findUnique({
        where:
          user.role === 'ADMIN' || user.role === 'SUPERADMIN'
            ? { id }
            : { id, user_id: user.id },
        include: {
          user: true,
          admin: true,
        },
      });

      if (!block) {
        throw new NotFoundException(`Block with id ${id} not found`);
      }

      return block;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch block: ' + error.message);
    }
  }

  async update(id: number, updateBlockDto: UpdateBlockDto) {
    try {
      // Check if block exists
      const existingBlock = await this.prisma.block.findUnique({
        where: { id },
      });

      if (!existingBlock) {
        throw new NotFoundException(`Block with id ${id} not found`);
      }

      // Convert UpdateBlockDto to Prisma update input
      const updateData: Prisma.BlockUpdateInput = {
        ...updateBlockDto,
        expire_date: updateBlockDto.expire_date || new Date(),
      };

      // Update block
      const updatedBlock = await this.prisma.block.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          admin: true,
        },
      });

      return updatedBlock;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update block: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      // Check if block exists
      const existingBlock = await this.prisma.block.findUnique({
        where: { id },
      });

      if (!existingBlock) {
        throw new NotFoundException(`Block with id ${id} not found`);
      }

      // Delete block
      return await this.prisma.block.delete({
        where: { id },
        include: {
          user: true,
          admin: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete block: ' + error.message);
    }
  }
}
