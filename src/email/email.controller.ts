import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';

@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  create(
    @Body() createEmailDto: CreateEmailDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.emailService.create(createEmailDto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  findAll(@GetUser() user: UserType | AdminType) {
    return this.emailService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.emailService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailDto: UpdateEmailDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.emailService.update(id, updateEmailDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.emailService.remove(id, user);
  }

  @Get('/verify/:id')
  @Public()
  verifyEmail(@Param('id') id: string) {
    return this.emailService.verifyEmail(id);
  }
}
