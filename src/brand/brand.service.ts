import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { PrismaService } from "../prisma/prisma.service"; // PrismaService yo'lini to'g'rilang
import { FileAmazonService } from "../file-amazon/file-amazon.service"; // FileAmazonService yo'lini to'g'rilang
import { Express } from "express";
import { Brand } from "@prisma/client";

@Injectable()
export class BrandService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileAmazonService: FileAmazonService // Fayl servis dependency injection
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    image: Express.Multer.File
  ): Promise<Brand> {
    try {
      let imageUrl: string | undefined = undefined;

      if (image) {
        imageUrl = await this.fileAmazonService.uploadFile(image); // Faylni S3 ga yuklash
      }

      const brand = await this.prismaService.brand.create({
        data: {
          ...createBrandDto,
          logo: imageUrl!, // image_url Prisma schemadagi maydon nomi bilan mos bo'lishi kerak
        },
      });
      return brand;
    } catch (error) {
      console.error("Error while creating brand:", error);
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        throw new BadRequestException(
          `Brand with name '${createBrandDto.name}' already exists.`
        );
      }
      throw new InternalServerErrorException({
        message: error.message || "Could not create brand",
      });
    }
  }

  async findAll(): Promise<Brand[]> {
    return this.prismaService.brand.findMany();
  }

  async findOne(id: number): Promise<Brand | null> {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
    image?: Express.Multer.File
  ): Promise<Brand> {
    try {
      const existingBrand = await this.prismaService.brand.findUnique({
        where: { id },
      });

      if (!existingBrand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }

      const dataToUpdate: any = { ...updateBrandDto }; // Yoki Prisma.BrandUpdateInput

      if (image) {
        if (existingBrand.logo) {
          try {
            console.warn(
              `Old brand image ${existingBrand.logo} was not deleted. Implement deletion if necessary.`
            );
          } catch (deleteError) {
            console.error(
              "Error deleting old brand image from S3:",
              deleteError
            );
          }
        }
        const newImageUrl = await this.fileAmazonService.uploadFile(image);
        dataToUpdate.image_url = newImageUrl;
      }

      if (Object.keys(updateBrandDto).length === 0 && !image) {
        throw new BadRequestException("No data provided for update.");
      }

      const updatedBrand = await this.prismaService.brand.update({
        where: { id },
        data: dataToUpdate,
      });

      return updatedBrand;
    } catch (error) {
      console.error("Error while updating brand:", error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (
        error.code === "P2002" &&
        error.meta?.target?.includes("name") &&
        updateBrandDto.name
      ) {
        throw new BadRequestException(
          `Brand with name '${updateBrandDto.name}' already exists.`
        );
      }
      throw new InternalServerErrorException({
        message: error.message || "Could not update brand",
      });
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const existingBrand = await this.prismaService.brand.findUnique({
        where: { id },
      });

      if (!existingBrand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }

      await this.prismaService.brand.delete({ where: { id } });

      return { message: `Brand with ID ${id} deleted successfully` };
    } catch (error) {
      console.error("Error while deleting brand:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === "P2003") {
        throw new BadRequestException(
          `Cannot delete brand with ID ${id} as it is still referenced by other records. Please update or delete those records first.`
        );
      }
      throw new InternalServerErrorException({
        message: error.message || "Could not delete brand",
      });
    }
  }
}
