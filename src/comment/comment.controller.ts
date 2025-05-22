import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.USER)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.commentService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.commentService.remove(id, user);
  }
}
