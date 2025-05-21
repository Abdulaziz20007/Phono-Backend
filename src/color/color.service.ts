import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Color } from "@prisma/client"; // <--- Prisma turini import qilish
import { CreateColorDto, UpdateColorDto } from "./dto";

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    try {
      const color = await this.prismaService.color.create({
        data: createColorDto,
      });
      return color;
    } catch (error) {
      if (error.code === "P2002") {
        if (error.meta?.target?.includes("name")) {
          throw new BadRequestException(
            `Color with name '${createColorDto.name}' already exists.`
          );
        }
      }
      console.error("Error creating color:", error);
      throw new InternalServerErrorException("Could not create color.");
    }
  }

  async findAll(): Promise<Color[]> {
    return this.prismaService.color.findMany();
  }

  async findOne(id: number): Promise<Color> {
    const color = await this.prismaService.color.findUnique({
      where: { id },
    });
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found.`);
    }
    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto): Promise<Color> {
    try {
      await this.findOne(id);
      const updatedColor = await this.prismaService.color.update({
        where: { id },
        data: updateColorDto,
      });
      return updatedColor;
    } catch (error) {
      if (error.code === "P2002") {
        if (error.meta?.target?.includes("name") && updateColorDto.name) {
          throw new BadRequestException(
            `Color with name '${updateColorDto.name}' already exists.`
          );
        }
      }
      console.error(`Error updating color with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Could not update color.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.prismaService.color.delete({
        where: { id },
      });
      return { message: `Color with ID ${id} deleted successfully.` };
    } catch (error) {
      console.error(`Error deleting color with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === "P2003") {
        throw new BadRequestException(
          `Cannot delete color with ID ${id} as it is still referenced by other records (e.g., Products).`
        );
      }
      throw new InternalServerErrorException("Could not delete color.");
    }
  }
}
