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
} from "@nestjs/common";
import { ModelService } from "./model.service";
import { CreateModelDto, UpdateModelDto } from "./dto";
import { ApiTags, ApiBody, ApiConsumes, ApiQuery } from "@nestjs/swagger";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { Model } from "@prisma/client";

@ApiTags("Model")
@Controller("model")
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @HttpCode(201)
  @ApiConsumes("multipart/form-data", "application/json")
  @UseInterceptors(NoFilesInterceptor())
  @ApiBody({ type: CreateModelDto })
  async create(@Body() createModelDto: CreateModelDto): Promise<Model> {
    return this.modelService.create(createModelDto);
  }

  @Get()
  @ApiQuery({
    name: "brandId",
    required: false,
    type: Number,
    description: "Brand ID bo'yicha filterlash",
  })
  async findAll(@Query("brandId") brandIdQuery?: string): Promise<Model[]> {
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

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Model> {
    return this.modelService.findOne(id);
  }

  @Patch(":id")
  @ApiConsumes("multipart/form-data", "application/json")
  @UseInterceptors(NoFilesInterceptor())
  @ApiBody({ type: UpdateModelDto })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateModelDto: UpdateModelDto
  ): Promise<Model> {
    return this.modelService.update(id, updateModelDto);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(
    @Param("id", ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    return this.modelService.remove(id);
  }
}
