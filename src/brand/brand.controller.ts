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

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
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
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() createBrandDto: CreateBrandDto,
    @GetUser() user: UserType | AdminType,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Brand logotipi yuklanishi shart!');
    }
    return this.brandService.create(createBrandDto, image);
  }

  @Get()
  @Public()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
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
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @GetUser() user: UserType | AdminType,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (Object.keys(updateBrandDto).length === 0 && !image) {
      throw new BadRequestException(
        "Yangilash uchun hech bo'lmaganda bitta maydon yoki rasm yuboring.",
      );
    }
    return this.brandService.update(id, updateBrandDto, image);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.brandService.remove(id);
  }
}
