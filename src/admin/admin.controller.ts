import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  ParseIntPipe,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto, UpdateAdminDto, UpdatePasswordDto } from "./dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { Admin } from "@prisma/client";
import { Express } from "express";

type AdminPublicData = Omit<Admin, "password" | "refresh_token">;
type SelectedAdminDataForPasswordUpdate = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  is_creator: boolean;
  avatar: string | null;
};

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(201)
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("avatar", {
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
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    })
  )
  @ApiBody({ type: CreateAdminDto })
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() avatarFile?: Express.Multer.File
  ): Promise<AdminPublicData> {
    return this.adminService.create(createAdminDto, avatarFile);
  }

  @Get()
  async findAll(): Promise<AdminPublicData[]> {
    return this.adminService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number
  ): Promise<AdminPublicData> {
    return this.adminService.findOne(id);
  }

  @Patch(":id")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("avatar", {
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
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    })
  )
  @ApiBody({ type: UpdateAdminDto })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile() avatarFile?: Express.Multer.File
  ): Promise<AdminPublicData> {
    if (Object.keys(updateAdminDto).length === 0 && !avatarFile) {
      throw new BadRequestException("Yangilash uchun ma'lumot yuborilmadi.");
    }
    return this.adminService.update(id, updateAdminDto, avatarFile);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.adminService.remove(id);
  }

  @Patch("update-password/:id")
  @HttpCode(200)
  @ApiConsumes("application/json")
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<{ message: string; data: SelectedAdminDataForPasswordUpdate }> {
    return this.adminService.updatePassword(id, updatePasswordDto);
  }
}
