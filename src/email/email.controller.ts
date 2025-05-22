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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';

@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @Roles('ADMIN', 'SUPERADMIN', 'USER')
  create(
    @Body() createEmailDto: CreateEmailDto,
    @User() user: UserType | AdminType,
  ) {
    return this.emailService.create(createEmailDto, user);
  }

  @Get()
  @Roles('ADMIN', 'SUPERADMIN', 'USER')
  findAll(@User() user: UserType | AdminType) {
    return this.emailService.findAll(user);
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERADMIN', 'USER')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserType | AdminType,
  ) {
    return this.emailService.findOne(id, user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERADMIN', 'USER')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailDto: UpdateEmailDto,
    @User() user: UserType | AdminType,
  ) {
    return this.emailService.update(id, updateEmailDto, user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERADMIN', 'USER')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserType | AdminType,
  ) {
    return this.emailService.remove(id, user);
  }
}
