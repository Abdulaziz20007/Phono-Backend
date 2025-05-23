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
} from '@nestjs/common';
import { PhoneService } from './phone.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.USER, Role.ADMIN)
  create(
    @Body() createPhoneDto: CreatePhoneDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.phoneService.create(createPhoneDto, user);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  findAll(@GetUser() user: UserType | AdminType) {
    return this.phoneService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.phoneService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhoneDto: UpdatePhoneDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.phoneService.update(id, updatePhoneDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.USER, Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.phoneService.remove(id, user);
  }
}
