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
  UseInterceptors, // <--- QO'SHILDI
} from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CreateCurrencyDto } from "./dto/create-currency.dto";
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { NoFilesInterceptor } from "@nestjs/platform-express"; // <--- QO'SHILDI

@ApiTags("Currency")
@Controller("currency")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @HttpCode(201)
  @ApiConsumes("multipart/form-data") // <--- Swagger uchun qo'shildi
  @UseInterceptors(NoFilesInterceptor()) // <--- QO'SHILDI: form-data ni parse qilish uchun
  @ApiBody({ type: CreateCurrencyDto })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    // Agar kerak bo'lsa, bu yerda kelgan DTO ni log qilib ko'rishingiz mumkin
    // console.log('Received DTO for currency:', createCurrencyDto);
    return this.currencyService.create(createCurrencyDto);
  }

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.currencyService.findOne(id);
  }

  @Patch(":id")
  @ApiConsumes("multipart/form-data") // <--- Agar update ham form-data qabul qilsa
  @UseInterceptors(NoFilesInterceptor()) // <--- Agar update ham form-data qabul qilsa
  @ApiBody({ type: CreateCurrencyDto }) // Yoki UpdateCurrencyDto
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCurrencyDto: any // UpdateCurrencyDto ni ishlating
  ) {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.currencyService.remove(id);
  }
}
