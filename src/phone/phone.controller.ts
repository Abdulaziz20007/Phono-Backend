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
import { Phone } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('phones')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(
    @Body() createPhoneDto: CreatePhoneDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.phoneService.create(createPhoneDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.phoneService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.phoneService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhoneDto: UpdatePhoneDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.phoneService.update(id, updatePhoneDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.phoneService.remove(id, user);
  }
}
