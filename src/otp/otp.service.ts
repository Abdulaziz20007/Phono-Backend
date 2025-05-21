import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOtpDto: CreateOtpDto) {
    return this.prisma.otp.create({
      data: createOtpDto,
    });
  }

  findAll() {
    return this.prisma.otp.findMany();
  }

  findOne(id: number) {
    return this.prisma.otp.findUnique({
      where: { id },
    });
  }

  findByUuid(uuid: string) {
    return this.prisma.otp.findUnique({
      where: { uuid },
    });
  }

  findByUserId(userId: number) {
    return this.prisma.otp.findFirst({
      where: { user_id: userId },
    });
  }

  update(id: number, updateOtpDto: UpdateOtpDto) {
    return this.prisma.otp.update({
      where: { id },
      data: updateOtpDto,
    });
  }

  remove(id: number) {
    return this.prisma.otp.delete({
      where: { id },
    });
  }
}
