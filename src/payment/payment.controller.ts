import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.paymentService.create({
      ...createPaymentDto,
      user_id: user.id,
    });
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async findOne(
    @Param('id') id: string,
    @GetUser() user: UserType | AdminType,
  ) {
    const payment = await this.paymentService.findOne(+id);
    if (user.role === Role.USER && payment?.user_id !== user.id) {
      throw new ForbiddenException('You can only access your own payments');
    }
    return payment;
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.paymentService.update(+id, updatePaymentDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string, @GetUser() user: UserType | AdminType) {
    return this.paymentService.remove(+id, user);
  }
}
