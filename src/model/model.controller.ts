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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateModelDto, UpdateModelDto } from './dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Model } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @UseInterceptors(NoFilesInterceptor())
  async create(
    @Body() createModelDto: CreateModelDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.modelService.create(createModelDto);
  }

  @Get()
  @Public()
  async findAll(@Query('brandId') brandIdQuery?: string) {
    // Parametr nomi o'zgartirildi
    let brandIdNumber: number | undefined = undefined;

    if (brandIdQuery) {
      // Agar brandIdQuery mavjud bo'lsa (bo'sh string emas)
      brandIdNumber = parseInt(brandIdQuery, 10);
      if (isNaN(brandIdNumber)) {
        throw new BadRequestException("brandId raqam bo'lishi kerak.");
      }
    }
    // Endi brandIdNumber yoki number yoki undefined
    return this.modelService.findAll(brandIdNumber);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modelService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(NoFilesInterceptor())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModelDto: UpdateModelDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.modelService.update(id, updateModelDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.modelService.remove(id);
  }
}
