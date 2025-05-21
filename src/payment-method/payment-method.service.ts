import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaymentMethodService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.prismaService.paymentMethod.create({
      data: createPaymentMethodDto,
      include: {
        payments: true,
      },
    });

    
  }

  findAll() {
    return this.prismaService.paymentMethod.findMany({
      include: {
        payments: true,
      },
    });
  }

  async findOne(id: number) {
    const paymentMethod = await this.prismaService.paymentMethod.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });
    if (!paymentMethod) throw new NotFoundException("Payment Method topilmadi");
    return paymentMethod;
  }

  async update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    try {
      return await this.prismaService.paymentMethod.update({
        where: { id },
        data: { ...updatePaymentMethodDto },
        include: {
          payments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.paymentMethod.delete({ where: { id } });
  }
}
