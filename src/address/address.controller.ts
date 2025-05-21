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
  Query, // Query parametrlari uchun
  UseGuards, // Guardlar uchun
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { ApiTags, ApiBody, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { Address } from "@prisma/client";
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Agar autentifikatsiya kerak bo'lsa
// import { GetUser } from '../auth/decorators/get-user.decorator'; // Agar user ma'lumotini olish kerak bo'lsa

@ApiTags("Addresses")
@Controller("addresses")
// @UseGuards(JwtAuthGuard) // Agar barcha endpointlar himoyalangan bo'lsa
// @ApiBearerAuth() // Swagger uchun
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Yangi manzil yaratish" })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 201, description: "Manzil muvaffaqiyatli yaratildi.", type: CreateAddressDto })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  create(
    @Body() createAddressDto: CreateAddressDto,
    // @GetUser('id') userId: number, // Agar guard bilan user_id avtomatik olinadigan bo'lsa
  ): Promise<Address> {
    // Agar user_id DTO da emas, tokendan olinsa:
    // return this.addressService.create({ ...createAddressDto, user_id: userId });
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha manzillarni (yoki user_id bo'yicha) olish" })
  @ApiQuery({ name: 'userId', required: false, type: Number, description: "Foydalanuvchi IDsi bo'yicha filtrlash" })
  @ApiResponse({ status: 200, description: "Manzillar ro'yxati.", type: [CreateAddressDto] })
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    // @GetUser('id') currentUserId: number, // Agar faqat o'zining manzillarini ko'rishi kerak bo'lsa
  ): Promise<Address[]> {
    // Agar faqat o'zining manzillarini olish kerak bo'lsa:
    // return this.addressService.findAll(currentUserId);
    return this.addressService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha manzilni olish" })
  @ApiResponse({ status: 200, description: "Manzil topildi.", type: CreateAddressDto })
  @ApiResponse({ status: 404, description: "Manzil topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "ID bo'yicha manzilni yangilash" })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ status: 200, description: "Manzil muvaffaqiyatli yangilandi.", type: CreateAddressDto })
  @ApiResponse({ status: 404, description: "Yangilanadigan manzil topilmadi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<Address> {
    return this.addressService.update(id, updateAddressDto);
  }

  @Patch(":id/set-active")
  // @UseGuards(JwtAuthGuard) // Yoki faqat shu endpoint uchun guard
  @ApiOperation({ summary: "Foydalanuvchining bir manzilini aktiv qilish (qolganlarini nofaol qiladi)" })
  @ApiResponse({ status: 200, description: "Manzil aktiv qilindi.", type: CreateAddressDto })
  @ApiResponse({ status: 404, description: "Manzil topilmadi." })
  setActive(
    @Param("id", ParseIntPipe) addressId: number,
    @Query('userId', ParseIntPipe) userId: number // Yoki @GetUser('id') userId: number dan olinadi
  ): Promise<Address> {
    return this.addressService.setActive(userId, addressId);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "ID bo'yicha manzilni o'chirish" })
  @ApiResponse({ status: 204, description: "Manzil muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: "O'chiriladigan manzil topilmadi." })
  @ApiResponse({ status: 400, description: "O'chirish imkonsiz." })
  remove(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.addressService.remove(id);
  }
}