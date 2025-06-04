import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, // id ni numberga o'tkazish uchun
  ForbiddenException, // Foydalanuvchi o'zining ma'lumotlarini o'zgartirishi uchun
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdatePasswordDto } from './dto/update-user.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type'; // Agar AdminType ishlatilsa
import { FavouriteItemType } from './user.service'; // Servisdan tipni import qilamiz

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get('/favouriteItem')
  @Roles(Role.USER)
  async favouriteItem(@GetUser() user: UserType) {
    return this.userService.favouriteItem(user);
  }

  @Get('/me')
  @Roles(Role.USER)
  me(@GetUser() user: UserType) {
    // Bu yerda ham aniq tip qaytarilishi mumkin
    return this.userService.me(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.userService.findOne(id);
  }

  @Get('/profile/:id')
  @Public()
  profile(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.userService.profile(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id', ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() userFromToken: UserType | AdminType, // Nomini o'zgartirdim, tushunarliroq bo'lishi uchun
  ) {
    // Agar foydalanuvchi admin bo'lmasa va o'zining id sini o'zgartirmayotgan bo'lsa
    if (
      (!('role' in userFromToken) || userFromToken.role !== Role.ADMIN) && // Agar UserType da role bo'lmasa
      userFromToken.id !== id
    ) {
      // Oddiy foydalanuvchi faqat o'zining ma'lumotlarini (userFromToken.id) o'zgartirishi mumkin
      // Boshqa birovning ma'lumotlarini (id) o'zgartirishga urinayotgan bo'lsa xatolik berish kerak
      // Yoki faqat o'zining ma'lumotlarini o'zgartirishga ruxsat berish:
      // throw new ForbiddenException("Siz faqat o'zingizni ma'lumotlaringizni o'zgartira olasiz.");
      return this.userService.update(userFromToken.id, updateUserDto); // Faqat o'zini o'zgartiradi
    }
    // Admin yoki o'zini o'zgartirayotgan foydalanuvchi
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/password/:id')
  @Roles(Role.USER)
  updatePassword(
    @Param('id', ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: UserType,
  ) {
    if (user.id !== id) {
      // Bu xabarni ForbiddenException bilan almashtirish yaxshiroq
      throw new ForbiddenException(
        "Siz faqat o'zingizni parolingizni o'zgartira olasiz",
      );
    }
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.userService.remove(id);
  }
}
