import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '@prisma/client';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { selfGuard } from '../common/self-guard';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCommentDto: CreateCommentDto, user: UserType | AdminType) {
    return this.prismaService.comment.create({
      data: {
        ...createCommentDto,
        user_id:
          user.role === 'ADMIN' || user.role === 'SUPERADMIN'
            ? createCommentDto.user_id!
            : user.id,
      },
    });
  }

  findAll() {
    return this.prismaService.comment.findMany();
  }

  async findOne(id: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: UserType | AdminType,
  ) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      selfGuard(user.id, comment);
    }

    return this.prismaService.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: number, user: UserType | AdminType) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      selfGuard(user.id, comment);
    }

    return this.prismaService.comment.delete({
      where: { id },
    });
  }
}
