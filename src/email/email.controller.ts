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
} from "@nestjs/common";
import { EmailService } from "./email.service";
import { CreateEmailDto } from "./dto/create-email.dto";
import { UpdateEmailDto } from "./dto/update-email.dto";
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Email } from "@prisma/client"; // For response type hinting

@ApiTags("Emails") // Changed tag
@Controller("emails") // Changed path to plural
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Yangi elektron pochta yaratish" })
  @ApiBody({ type: CreateEmailDto })
  @ApiResponse({ status: 201, description: "Elektron pochta muvaffaqiyatli yaratildi.", type: CreateEmailDto }) // Using DTO for example, actual response is Email entity
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov (masalan, email mavjud yoki user_id topilmadi)." })
  create(@Body() createEmailDto: CreateEmailDto): Promise<Email> {
    return this.emailService.create(createEmailDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha elektron pochtalarni olish" })
  @ApiResponse({ status: 200, description: "Barcha elektron pochtalar ro'yxati.", type: [CreateEmailDto] }) // Using DTO array for example
  findAll(): Promise<Email[]> {
    return this.emailService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha elektron pochtani olish" })
  @ApiResponse({ status: 200, description: "Elektron pochta topildi.", type: CreateEmailDto }) // Using DTO for example
  @ApiResponse({ status: 404, description: "Elektron pochta topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Email> {
    return this.emailService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "ID bo'yicha elektron pochtani yangilash" })
  @ApiBody({ type: UpdateEmailDto })
  @ApiResponse({ status: 200, description: "Elektron pochta muvaffaqiyatli yangilandi.", type: CreateEmailDto }) // Using DTO for example
  @ApiResponse({ status: 404, description: "Yangilanadigan elektron pochta topilmadi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEmailDto: UpdateEmailDto
  ): Promise<Email> {
    return this.emailService.update(id, updateEmailDto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "ID bo'yicha elektron pochtani o'chirish" })
  @ApiResponse({ status: 204, description: "Elektron pochta muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: "O'chiriladigan elektron pochta topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.emailService.remove(id);
  }
}