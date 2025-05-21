import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException, // Import NotFoundException
} from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment, Prisma } from "@prisma/client"; // Import Prisma types
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      // Optional: Check if user and product exist before creating comment
      const userExists = await this.prismaService.user.findUnique({
        where: { id: createCommentDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `User with ID ${createCommentDto.user_id} not found.`
        );
      }

      const productExists = await this.prismaService.product.findUnique({
        where: { id: createCommentDto.product_id },
      });
      if (!productExists) {
        throw new BadRequestException(
          `Product with ID ${createCommentDto.product_id} not found.`
        );
      }

      const comment = await this.prismaService.comment.create({
        data: createCommentDto,
      });
      return comment;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Foreign key constraint failed
        if (error.code === "P2003") {
          const field = error.meta?.field_name as string;
          if (field?.includes("user_id")) {
            throw new BadRequestException(
              `User with ID '${createCommentDto.user_id}' does not exist.`
            );
          }
          if (field?.includes("product_id")) {
            throw new BadRequestException(
              `Product with ID '${createCommentDto.product_id}' does not exist.`
            );
          }
          throw new BadRequestException(
            "Foreign key constraint failed. Ensure user and product exist."
          );
        }
      }
      console.error("Error creating comment:", error);
      throw new InternalServerErrorException("Could not create comment.");
    }
  }

  async findAll(): Promise<Comment[]> {
    return this.prismaService.comment.findMany({
      include: { user: true, product: true }, // Optional: include related data
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
      include: { user: true, product: true }, // Optional: include related data
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found.`);
    }
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto
  ): Promise<Comment> {
    // First, check if the comment exists
    await this.findOne(id);

    // Optional: If user_id or product_id is being updated, check if they exist
    if (updateCommentDto.user_id) {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: updateCommentDto.user_id },
      });
      if (!userExists) {
        throw new BadRequestException(
          `User with ID ${updateCommentDto.user_id} not found for update.`
        );
      }
    }
    if (updateCommentDto.product_id) {
      const productExists = await this.prismaService.product.findUnique({
        where: { id: updateCommentDto.product_id },
      });
      if (!productExists) {
        throw new BadRequestException(
          `Product with ID ${updateCommentDto.product_id} not found for update.`
        );
      }
    }

    try {
      const updatedComment = await this.prismaService.comment.update({
        where: { id },
        data: updateCommentDto,
      });
      return updatedComment;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") { // Foreign key constraint failed
            const field = error.meta?.field_name as string;
            if (field?.includes("user_id") && updateCommentDto.user_id) {
              throw new BadRequestException(
                `User with ID '${updateCommentDto.user_id}' does not exist.`
              );
            }
            if (field?.includes("product_id") && updateCommentDto.product_id) {
              throw new BadRequestException(
                `Product with ID '${updateCommentDto.product_id}' does not exist.`
              );
            }
            throw new BadRequestException("Foreign key constraint failed during update.");
        }
        if (error.code === "P2025") { // Record to update not found
            throw new NotFoundException(`Comment with ID ${id} not found for update.`);
        }
      }
      console.error(`Error updating comment with ID ${id}:`, error);
      throw new InternalServerErrorException("Could not update comment.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    // First, check if the comment exists
    await this.findOne(id);

    try {
      await this.prismaService.comment.delete({
        where: { id },
      });
      return { message: `Comment with ID ${id} deleted successfully.` };
    } catch (error) {
      if (error instanceof NotFoundException) { // Should be caught by findOne
          throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") { // Record to delete not found
            throw new NotFoundException(`Comment with ID ${id} not found for deletion.`);
        }
      }
      console.error(`Error deleting comment with ID ${id}:`, error);
      throw new InternalServerErrorException("Could not delete comment.");
    }
  }
}