// src/favourite-item/favourite-item.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards, // Agar autentifikatsiya kerak bo'lsa
  Req,        // Foydalanuvchi ID sini request dan olish uchun
} from "@nestjs/common";
import { FavouriteItemService } from "./favourite-item.service";
import { CreateFavouriteItemDto } from "./dto/create-favourite-item.dto";
import { ApiTags, ApiBody, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { FavouriteItem } from "@prisma/client";

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Agar JWT autentifikatsiyangiz bo'lsa

@ApiTags("Sevimlilar") // Swagger uchun teg nomi
@Controller("favourite-items") // Marshrut prefiksi
export class FavouriteItemController {
  constructor(private readonly favouriteItemService: FavouriteItemService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Misol: Agar faqat autentifikatsiyadan o'tgan foydalanuvchilar qo'sha olsa
  @ApiBearerAuth() // Agar JWT ishlatilsa Swagger uchun
  @HttpCode(201)
  @ApiOperation({ summary: "Mahsulotni sevimlilarga qo'shish" })
  @ApiBody({ type: CreateFavouriteItemDto })
  @ApiResponse({ status: 201, description: "Mahsulot sevimlilarga muvaffaqiyatli qo'shildi.", type: CreateFavouriteItemDto }) // DTO yoki to'liq Entity (FavouriteItem)
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov (masalan, user_id yoki product_id mavjud emas, yoki allaqachon qo'shilgan)." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." }) // Agar @UseGuards ishlatilsa
  create(
    @Body() createFavouriteItemDto: CreateFavouriteItemDto
    // @Req() req // Agar user_id ni JWT dan olmoqchi bo'lsangiz
  ): Promise<FavouriteItem> {
    // Agar user_id ni JWT dan olsangiz:
    // const userIdFromJwt = req.user.id;
    // createFavouriteItemDto.user_id = userIdFromJwt;
    return this.favouriteItemService.create(createFavouriteItemDto);
  }

  @Get("user/:userId")
  // @UseGuards(JwtAuthGuard) // Misol: Agar faqat o'zining sevimlilarini ko'ra olsa
  @ApiBearerAuth()
  @ApiOperation({ summary: "Foydalanuvchining barcha sevimlilarini olish" })
  @ApiResponse({ status: 200, description: "Foydalanuvchining sevimlilari ro'yxati."}) // FavouriteItem massivi
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  findAllByUserId(
    @Param("userId", ParseIntPipe) userId: number
    // @Req() req // Agar faqat o'zining sevimlilarini olishini tekshirish kerak bo'lsa
  ): Promise<FavouriteItem[]> {
    // if (req.user.id !== userId && !req.user.isAdmin) { // Misol uchun tekshiruv
    //   throw new ForbiddenException("Siz faqat o'zingizning sevimlilaringizni ko'ra olasiz.");
    // }
    return this.favouriteItemService.findAllByUserId(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha sevimlilar yozuvini olish" })
  @ApiResponse({ status: 200, description: "Sevimlilar yozuvi topildi." })
  @ApiResponse({ status: 404, description: "Sevimlilar yozuvi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<FavouriteItem> {
    return this.favouriteItemService.findOne(id);
  }

  @Delete(":id")
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200) // Message qaytarilgani uchun 200 yoki 204 (agar message bo'lmasa)
  @ApiOperation({ summary: "ID bo'yicha sevimlilar yozuvini o'chirish" })
  @ApiResponse({ status: 200, description: "Sevimlilar yozuvi muvaffaqiyatli o'chirildi."})
  @ApiResponse({ status: 204, description: "Sevimlilar yozuvi muvaffaqiyatli o'chirildi (javob tanasi yo'q)." })
  @ApiResponse({ status: 404, description: "O'chiriladigan sevimlilar yozuvi topilmadi." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  async remove(
    @Param("id", ParseIntPipe) id: number
    // @Req() req // O'chirishga huquqini tekshirish uchun
  ): Promise<{ message: string }> {
    // const favouriteItem = await this.favouriteItemService.findOne(id); // Yozuvni olish
    // if (favouriteItem.user_id !== req.user.id && !req.user.isAdmin) { // Misol: faqat o'ziniki yoki admin o'chira olsin
    //    throw new ForbiddenException("Bu yozuvni o'chirishga huquqingiz yo'q.");
    // }
    return this.favouriteItemService.remove(id);
  }

  // Mahsulot IDsi va Foydalanuvchi IDsi bo'yicha o'chirish uchun endpoint
  @Delete("user/:userId/product/:productId")
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: "Mahsulotni foydalanuvchining sevimlilaridan o'chirish" })
  @ApiResponse({ status: 200, description: "Mahsulot sevimlilardan muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: "Foydalanuvchi, mahsulot yoki sevimlilar yozuvi topilmadi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  async removeByProductAndUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("productId", ParseIntPipe) productId: number
    // @Req() req // O'chirishga huquqini tekshirish uchun
  ): Promise<{ message: string }> {
    // if (userId !== req.user.id && !req.user.isAdmin) {
    //   throw new ForbiddenException("Bu amalni bajarishga huquqingiz yo'q.");
    // }
    return this.favouriteItemService.removeByProductIdAndUserId(productId, userId);
  }
}