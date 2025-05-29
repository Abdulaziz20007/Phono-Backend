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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Admin } from '@prisma/client';
import { Express } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';
import { Public } from '../common/decorators/public.decorator';

type AdminPublicData = Omit<Admin, 'password' | 'refresh_token'>;
type SelectedAdminDataForPasswordUpdate = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  avatar: string | null;
};

@Controller('admin')
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  // @Public()
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(
            new BadRequestException(
              'Faqat rasm fayllari (jpg, jpeg, png, gif) yuklanishi mumkin!',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @GetUser() user: UserType | AdminType,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    console.log('a');

    return this.adminService.create(createAdminDto, avatarFile);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @GetUser() user: UserType | AdminType,
  ): Promise<AdminPublicData[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ): Promise<AdminPublicData> {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(
            new BadRequestException(
              'Faqat rasm fayllari (jpg, jpeg, png, gif) yuklanishi mumkin!',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @GetUser() user: AdminType,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    if (Object.keys(updateAdminDto).length === 0 && !avatarFile) {
      throw new BadRequestException("Yangilash uchun ma'lumot yuborilmadi.");
    }
    return this.adminService.update(id, updateAdminDto, user, avatarFile);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AdminType,
  ) {
    await this.adminService.remove(id, user);
  }

  @Patch('update-password/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: AdminType,
  ): Promise<{ message: string; data: SelectedAdminDataForPasswordUpdate }> {
    return this.adminService.updatePassword(id, updatePasswordDto, user);
  }
}
