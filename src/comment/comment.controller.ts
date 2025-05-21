import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  // UseInterceptors, // Not needed if not using form-data
  // NoFilesInterceptor, // Not needed if not using form-data
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto"; // Import UpdateCommentDto
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger"; // ApiConsumes removed if not form-data
import { Comment } from "@prisma/client"; // Import Prisma Comment type for response examples

@ApiTags("Comments") // Changed tag
@Controller("comments") // Changed path to plural
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Yangi izoh yaratish" })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: "Izoh muvaffaqiyatli yaratildi.", type: CreateCommentDto }) // Example type, adjust if you return full entity
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov (masalan, user_id yoki product_id mavjud emas)." })
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha izohlarni olish" })
  @ApiResponse({ status: 200, description: "Barcha izohlar ro'yxati.", type: [CreateCommentDto] }) // Example type
  findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha izohni olish" })
  @ApiResponse({ status: 200, description: "Izoh topildi.", type: CreateCommentDto }) // Example type
  @ApiResponse({ status: 404, description: "Izoh topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "ID bo'yicha izohni yangilash" })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: "Izoh muvaffaqiyatli yangilandi.", type: CreateCommentDto }) // Example type
  @ApiResponse({ status: 404, description: "Yangilanadigan izoh topilmadi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<Comment> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(":id")
  @HttpCode(204) // Standard for successful delete with no content response
  @ApiOperation({ summary: "ID bo'yicha izohni o'chirish" })
  @ApiResponse({ status: 204, description: "Izoh muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: "O'chiriladigan izoh topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
    // Service returns a message object, so we reflect that here.
    // If you prefer strictly 204, service should return Promise<void>
    return this.commentService.remove(id);
  }
}