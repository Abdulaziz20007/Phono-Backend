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
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express'; // <--- QO'SHILDI
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @UseInterceptors(NoFilesInterceptor()) // <--- QO'SHILDI: form-data ni parse qilish uchun
  create(
    @Body() createCurrencyDto: CreateCurrencyDto,
    @GetUser() user: UserType | AdminType,
  ) {
    // Agar kerak bo'lsa, bu yerda kelgan DTO ni log qilib ko'rishingiz mumkin
    // console.log('Received DTO for currency:', createCurrencyDto);
    return this.currencyService.create(createCurrencyDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.currencyService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(NoFilesInterceptor()) // <--- Agar update ham form-data qabul qilsa
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: any, // UpdateCurrencyDto ni ishlating
    @GetUser() user: UserType | AdminType,
  ) {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.currencyService.remove(id);
  }
}
