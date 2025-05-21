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
} from "@nestjs/common";
import { PhoneService } from "./phone.service";
import { CreatePhoneDto } from "./dto/create-phone.dto";
import { UpdatePhoneDto } from "./dto/update-phone.dto";
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Phone } from "@prisma/client";

@ApiTags("Phones") // Tegni o'zgartirish
@Controller("phones") // Yo'lni ko'plikka o'zgartirish
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Yangi telefon raqami yaratish" })
  @ApiBody({ type: CreatePhoneDto })
  @ApiResponse({ status: 201, description: "Telefon raqami muvaffaqiyatli yaratildi.", type: CreatePhoneDto })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  create(@Body() createPhoneDto: CreatePhoneDto): Promise<Phone> {
    return this.phoneService.create(createPhoneDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha telefon raqamlarini olish" })
  @ApiResponse({ status: 200, description: "Barcha telefon raqamlari ro'yxati.", type: [CreatePhoneDto] })
  findAll(): Promise<Phone[]> {
    return this.phoneService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha telefon raqamini olish" })
  @ApiResponse({ status: 200, description: "Telefon raqami topildi.", type: CreatePhoneDto })
  @ApiResponse({ status: 404, description: "Telefon raqami topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Phone> {
    return this.phoneService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "ID bo'yicha telefon raqamini yangilash" })
  @ApiBody({ type: UpdatePhoneDto })
  @ApiResponse({ status: 200, description: "Telefon raqami muvaffaqiyatli yangilandi.", type: CreatePhoneDto })
  @ApiResponse({ status: 404, description: "Yangilanadigan telefon raqami topilmadi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePhoneDto: UpdatePhoneDto
  ): Promise<Phone> {
    return this.phoneService.update(id, updatePhoneDto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "ID bo'yicha telefon raqamini o'chirish" })
  @ApiResponse({ status: 204, description: "Telefon raqami muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: "O'chiriladigan telefon raqami topilmadi." })
  @ApiResponse({ status: 400, description: "O'chirish imkonsiz (masalan, boshqa yozuvlarga bog'langan)." })
  remove(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.phoneService.remove(id);
  }
}