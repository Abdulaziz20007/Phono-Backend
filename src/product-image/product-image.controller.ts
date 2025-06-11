import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpCode,
  ParseIntPipe,
  Query, // For optional query parameters
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

// Reusable file filter options
const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return callback(
      new BadRequestException(
        'Only image files (jpg, jpeg, png, gif) are allowed!',
      ),
      false,
    );
  }
  callback(null, true);
};

const imageUploadLimits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

@Controller('product-image') // Changed to plural and kebab-case for RESTful convention
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // 'images' must match the key in createdto, allow up to 10 files
      fileFilter: imageFileFilter,
      limits: imageUploadLimits,
    }),
  )
  create(
    @Body() createProductImageDto: CreateProductImageDto,
    @GetUser() user: UserType | AdminType,
    @UploadedFiles() imageFiles: Express.Multer.File[],
  ) {
    if (!imageFiles || imageFiles.length === 0) {
      // double check, though interceptor should handle required
      throw new BadRequestException(
        'at least one product image file is required.',
      );
    }
    // the 'images' property in dto is for swagger, actual files are in imagefiles
    return this.productImageService.create(createProductImageDto, imageFiles);
  }

  @Get()
  @Public()
  findAll(
    @Query('productId', new ParseIntPipe({ optional: true }))
    productId?: number,
  ) {
    return this.productImageService.findAll(productId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // 'images' must match the key in updatedto
      fileFilter: imageFileFilter,
      limits: imageUploadLimits,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductImageDto: UpdateProductImageDto,
    @GetUser() user: UserType | AdminType,
    @UploadedFiles() imageFiles?: Express.Multer.File[], // images are optional for update
  ) {
    if (
      Object.keys(updateProductImageDto).length === 0 &&
      (!imageFiles || imageFiles.length === 0)
    ) {
      throw new BadRequestException(
        'at least one field to update or a new image must be provided.',
      );
    }
    return this.productImageService.update(
      id,
      updateProductImageDto,
      imageFiles,
    );
  }

  @Patch(':id/set-main')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  setMainImage(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.productImageService.setMainImage(id);
  }

  @Post('reset-sequence')
  @HttpCode(200)
  @Roles(Role.ADMIN) // Only accessible by admin
  resetSequence() {
    return this.productImageService.resetSequence();
  }

  @Delete(':id')
  @HttpCode(204) // No Content for successful deletion
  @Roles(Role.ADMIN, Role.USER)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType | AdminType,
  ) {
    await this.productImageService.remove(id);
    // No content returned, so no explicit return statement needed for data
  }
}
