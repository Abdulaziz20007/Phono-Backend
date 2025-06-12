import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdatePasswordDto } from './dto/update-user.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';
import { FavouriteItemType } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

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
    return this.userService.me(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get('/profile/:id')
  @Public()
  profile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.profile(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() userFromToken: UserType | AdminType,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    if (
      (!('role' in userFromToken) || userFromToken.role !== Role.ADMIN) &&
      userFromToken.id !== id
    ) {
      return this.userService.update(
        userFromToken.id,
        updateUserDto,
        avatarFile,
      );
    }
    return this.userService.update(id, updateUserDto, avatarFile);
  }

  @Patch('/password/:id')
  @Roles(Role.USER)
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: UserType,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException(
        "Siz faqat o'zingizni parolingizni o'zgartira olasiz",
      );
    }
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
