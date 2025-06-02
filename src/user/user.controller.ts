import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  @Get('/me')
  @Roles(Role.USER)
  me(@GetUser() user: UserType) {
    return this.userService.me(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('/profile/:id')
  @Public()
  profile(@Param('id') id: string) {
    return this.userService.profile(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UserType | AdminType,
  ) {
    if (user.role !== Role.ADMIN && user.id !== +id) {
      return this.userService.update(user.id, updateUserDto);
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('/password/:id')
  @Roles(Role.USER)
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: UserType,
  ) {
    if (user.id !== +id) {
      return { message: "Siz faqat o'zingizni parolingizni o'zgartira olasiz" };
    }
    return this.userService.updatePassword(+id, updatePasswordDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
