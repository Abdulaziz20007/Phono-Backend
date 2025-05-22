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
  Query,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserType } from 'src/common/types/user.type';
import { AdminType } from 'src/common/types/admin.type';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.USER, Role.ADMIN)
  create(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser() user: UserType | AdminType,
  ) {
    console.log('A');
    return this.addressService.create(createAddressDto, user);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  findAll(@GetUser() user: UserType | AdminType) {
    return this.addressService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.addressService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.addressService.update(id, updateAddressDto, user);
  }

  @Delete(':id')
  @Roles(Role.USER, Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.addressService.remove(id, user);
  }
}
