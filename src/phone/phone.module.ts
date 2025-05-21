import { Module } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PhoneController],
  providers: [PhoneService, PrismaService],
  exports: [PhoneService],
})
export class PhoneModule {}
