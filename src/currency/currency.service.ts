import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { CreateCurrencyDto } from "./dto/create-currency.dto";
import { PrismaService } from "../prisma/prisma.service"; // O'zingizning PrismaService yo'lingizni ko'rsating
import { Currency } from "@prisma/client";

@Injectable()
export class CurrencyService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    // Promise<Currency> bo'lishi kerak
    try {
      const currency = await this.prismaService.currency.create({
        data: createCurrencyDto,
      });
      return currency;
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        throw new BadRequestException(
          `Currency with name '${createCurrencyDto.name}' already exists.`
        );
      }
      console.error("Error creating currency:", error);
      throw new InternalServerErrorException("Could not create currency.");
    }
  }

  async findAll(): Promise<any[]> {
    return this.prismaService.currency.findMany();
  }

  async findOne(id: number): Promise<any> {
    const currency = await this.prismaService.currency.findUnique({
      where: { id },
    });
    if (!currency) {
      throw new BadRequestException(`Currency with ID ${id} not found.`);
    }
    return currency;
  }

  async update(id: number, updateCurrencyDto: any): Promise<any> {
    // UpdateCurrencyDto ni import qiling
    try {
      const existingCurrency = await this.findOne(id);
      const updatedCurrency = await this.prismaService.currency.update({
        where: { id },
        data: updateCurrencyDto,
      });
      return updatedCurrency;
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        throw new BadRequestException(
          `Currency with name '${updateCurrencyDto.name}' already exists.`
        );
      }
      console.error(`Error updating currency with ID ${id}:`, error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException("Could not update currency.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.findOne(id); // Mavjudligini tekshirish
      await this.prismaService.currency.delete({
        where: { id },
      });
      return { message: `Currency with ID ${id} deleted successfully.` };
    } catch (error) {
      console.error(`Error deleting currency with ID ${id}:`, error);
      if (error instanceof BadRequestException) throw error;
      if (error.code === "P2003") {
        throw new BadRequestException(
          `Cannot delete currency with ID ${id} as it is still referenced by other records.`
        );
      }
      throw new InternalServerErrorException("Could not delete currency.");
    }
  }
}
