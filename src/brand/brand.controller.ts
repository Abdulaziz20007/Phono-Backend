import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  ParseIntPipe, // ID ni number ga o'tkazish uchun
} from "@nestjs/common";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger"; // ApiTags qo'shildi
import { Express } from "express";

@ApiTags("Brand") // Swagger guruhlash uchun
@Controller("brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(201) // Yaratilganda 201 status qaytarish yaxshiroq
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("image", {
      // 'image' form-data dagi fayl maydonining nomi
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(
            new BadRequestException(
              "Faqat rasm fayllari (jpg, jpeg, png, gif) yuklanishi mumkin!"
            ),
            false
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // Masalan, 5MB
      },
    })
  )
  create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() image: Express.Multer.File // Rasm ixtiyoriy
  ) {
    if (!image) {
      throw new BadRequestException("Brand logotipi yuklanishi shart!");
    }
    return this.brandService.create(createBrandDto, image);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ID ni number ga aylantiradi
    return this.brandService.findOne(id);
  }

  @Patch(":id")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("image", {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(
            new BadRequestException(
              "Faqat rasm fayllari (jpg, jpeg, png, gif) yuklanishi mumkin!"
            ),
            false
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // Masalan, 5MB
      },
    })
  )
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (Object.keys(updateBrandDto).length === 0 && !image) {
      throw new BadRequestException(
        "Yangilash uchun hech bo‘lmaganda bitta maydon yoki rasm yuboring."
      );
    }
    return this.brandService.update(id, updateBrandDto, image);
  }

  @Delete(":id")
  @HttpCode(204) // Muvaffaqiyatli o'chirilganda odatda 204 No Content qaytariladi
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
