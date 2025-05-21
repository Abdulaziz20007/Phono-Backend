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
} from "@nestjs/common";
import { ColorService } from "./color.service";
import { CreateColorDto, UpdateColorDto } from "./dto";
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { Color } from "@prisma/client";

@ApiTags("Color")
@Controller("color")
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @HttpCode(201)
  @ApiConsumes("multipart/form-data", "application/json") // form-data va JSON ni qo'llab-quvvatlash
  @UseInterceptors(NoFilesInterceptor()) // form-data uchun
  @ApiBody({ type: CreateColorDto })
  async create(@Body() createColorDto: CreateColorDto): Promise<Color> {
    return this.colorService.create(createColorDto);
  }

  @Get()
  async findAll(): Promise<Color[]> {
    return this.colorService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Color> {
    return this.colorService.findOne(id);
  }

  @Patch(":id")
  @ApiConsumes("multipart/form-data", "application/json") // form-data va JSON ni qo'llab-quvvatlash
  @UseInterceptors(NoFilesInterceptor()) // form-data uchun
  @ApiBody({ type: UpdateColorDto })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateColorDto: UpdateColorDto
  ): Promise<Color> {
    return this.colorService.update(id, updateColorDto);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(
    @Param("id", ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    return this.colorService.remove(id);
  }
}
