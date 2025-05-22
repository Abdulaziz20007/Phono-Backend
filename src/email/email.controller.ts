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
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Email } from '@prisma/client'; // For response type hinting
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('emails')
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HttpCode(201)
  create(
    @Body() createEmailDto: CreateEmailDto,
    @GetUser() user: UserType | AdminType,
  ): Promise<Email> {
    return this.emailService.create(createEmailDto);
  }

  @Get()
  findAll(@GetUser() user: UserType | AdminType): Promise<Email[]> {
    return this.emailService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<Email> {
    return this.emailService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailDto: UpdateEmailDto,
    @GetUser() user: UserType | AdminType,
  ): Promise<Email> {
    return this.emailService.update(id, updateEmailDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<{ message: string }> {
    return this.emailService.remove(id, user);
  }
}
