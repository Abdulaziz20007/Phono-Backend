import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AdminType } from '../common/types/admin.type';
import { UserType } from '../common/types/user.type';
import { selfGuard } from '../common/self-guard';

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, user: UserType | AdminType) {
    console.log('A');

    return this.prismaService.address.create({
      data: {
        ...createAddressDto,
        user_id:
          user.role === 'ADMIN' || user.role === 'SUPERADMIN'
            ? createAddressDto.user_id!
            : user.id,
      },
    });
  }

  async findAll(user: UserType | AdminType) {
    return this.prismaService.address.findMany({
      where:
        user.role === 'ADMIN' || user.role === 'SUPERADMIN'
          ? {}
          : { user_id: user.id },
    });
  }

  async findOne(id: number, user: UserType | AdminType) {
    const address = await this.prismaService.address.findUnique({
      where:
        user.role === 'ADMIN' || user.role === 'SUPERADMIN'
          ? { id }
          : { id, user_id: user.id },
    });
    if (!address) {
      throw new NotFoundException('Manzil topilmadi');
    }
    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
    user: UserType | AdminType,
  ) {
    const address = await this.prismaService.address.findUnique({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException('Manzil topilmadi');
    }
    selfGuard(user.id, address);
    return this.prismaService.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async remove(id: number, user: UserType | AdminType) {
    const address = await this.prismaService.address.findUnique({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException('Manzil topilmadi');
    }
    selfGuard(user.id, address);
    await this.prismaService.address.delete({
      where: { id },
    });
    return { message: "Manzil o'chirildi" };
  }
}
