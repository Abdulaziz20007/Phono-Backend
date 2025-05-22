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
  ParseIntPipe,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';
import { Brand } from '@prisma/client';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      // Fayl maydoni nomi 'logo' bo'lishi logikroq
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          // Ko'proq rasm formatlari
          return callback(
            new BadRequestException(
              'Faqat rasm fayllari (jpg, jpeg, png, gif, svg, webp) yuklanishi mumkin!',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  create(
    @Body() createBrandDto: CreateBrandDto,
    @GetUser() user: UserType | AdminType, // Bu parametr ishlatilmayapti service.create da, agar kerak bo'lsa uzating
    @UploadedFile() logo: Express.Multer.File,
  ): Promise<Brand> {
    if (!logo) {
      throw new BadRequestException('Brand logotipi yuklanishi shart!');
    }
    return this.brandService.create(createBrandDto, logo);
  }

  @Get()
  @Public()
  findAll(): Promise<Brand[]> {
    return this.brandService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Brand | null> {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      // Fayl maydoni nomi 'logo'
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          return callback(
            new BadRequestException(
              'Faqat rasm fayllari (jpg, jpeg, png, gif, svg, webp) yuklanishi mumkin!',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @GetUser() user: UserType | AdminType, // Bu parametr ishlatilmayapti service.update da, agar kerak bo'lsa uzating
    @UploadedFile() logo?: Express.Multer.File,
  ): Promise<Brand> {
    if (Object.keys(updateBrandDto).length === 0 && !logo) {
      throw new BadRequestException(
        "Yangilash uchun hech bo'lmaganda bitta maydon yoki rasm yuboring.",
      );
    }
    return this.brandService.update(id, updateBrandDto, logo);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType, // Bu parametr ishlatilmayapti service.remove da, agar kerak bo'lsa uzating
  ): Promise<{ message: string }> {
    return this.brandService.remove(id);
  }
}
