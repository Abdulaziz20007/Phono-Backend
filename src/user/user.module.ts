import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FileAmazonModule } from '../file-amazon/file-amazon.module';

@Module({
  imports: [PrismaModule, FileAmazonModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
