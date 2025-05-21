import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BlocksService } from './block.service';

@Module({
  imports: [PrismaModule],
  controllers: [BlockController],
  providers: [BlocksService],
})
export class BlockModule {}
