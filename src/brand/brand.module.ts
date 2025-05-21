import { Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { FileAmazonService } from "../file-amazon/file-amazon.service";

@Module({
  imports: [PrismaModule],
  controllers: [BrandController],
  providers: [BrandService, FileAmazonService],
  exports: [BrandService],
})
export class BrandModule {}
