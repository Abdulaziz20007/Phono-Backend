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
  UseInterceptors,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto, UpdateColorDto } from './dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Color } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseInterceptors(NoFilesInterceptor()) // form-data uchun
  async create(
    @Body() createColorDto: CreateColorDto,
    @GetUser() user: UserType | AdminType,
  ): Promise<Color> {
    return this.colorService.create(createColorDto);
  }

  @Get()
  @Public()
  async findAll(): Promise<Color[]> {
    return this.colorService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Color> {
    return this.colorService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseInterceptors(NoFilesInterceptor()) // form-data uchun
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColorDto: UpdateColorDto,
    @GetUser() user: UserType | AdminType,
  ): Promise<Color> {
    return this.colorService.update(id, updateColorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<{ message: string }> {
    return this.colorService.remove(id);
  }
}
