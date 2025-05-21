import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { user_id, amount, payment_method_id } = createPaymentDto;
      if (!user_id) {
        throw new BadRequestException('User ID is required');
      }
      const user = await this.prismaService.user.findUnique({
        where: { id: user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${user_id} not found`);
      }
      const newPayment = await this.prismaService.payment.create({
        data: {
          user_id,
          amount: amount,
          payment_method_id,
        },
      });
      return newPayment;
    } catch (error) {
      console.log('create payment', error);
      throw error;
    }
  }

  findAll() {
    return this.prismaService.payment.findMany({
      include: { user: true, payment_method: true },
    });
  }

  async findOne(id: number) {
    try {
      const payment = await this.prismaService.payment.findUnique({
        where: { id },
      });
      return payment;
    } catch (error) {
      console.log('findOne payment', error);
      throw error;
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const updatedPayment = await this.prismaService.payment.update({
        where: { id },
        data: { ...updatePaymentDto },
      });
      return updatedPayment;
    } catch (error) {
      console.log('update payment ', error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.payment.delete({ where: { id } });
  }
}
