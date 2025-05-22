import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  @Public()
  create(@Body() createOtpDto: CreateOtpDto) {
    return this.otpService.create(createOtpDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(@GetUser() user: UserType | AdminType) {
    return this.otpService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string, @GetUser() user: UserType | AdminType) {
    return this.otpService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateOtpDto: UpdateOtpDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.otpService.update(+id, updateOtpDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: UserType | AdminType) {
    return this.otpService.remove(+id);
  }
}
