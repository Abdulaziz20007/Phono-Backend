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
  Query, // For optional query parameters
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
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
    FileInterceptor('image', {
      // 'image' must match the key in CreateProductImageDto for Swagger
      fileFilter: imageFileFilter,
      limits: imageUploadLimits,
    }),
  )
  create(
    @Body() createProductImageDto: CreateProductImageDto,
    @GetUser() user: UserType | AdminType,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    if (!imageFile) {
      // Double check, though interceptor should handle required
      throw new BadRequestException('Product image file is required.');
    }
    // The 'image' property in DTO is for Swagger, actual file is in imageFile
    return this.productImageService.create(createProductImageDto, imageFile);
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
    FileInterceptor('image', {
      // 'image' must match the key in UpdateProductImageDto
      fileFilter: imageFileFilter,
      limits: imageUploadLimits,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductImageDto: UpdateProductImageDto,
    @GetUser() user: UserType | AdminType,
    @UploadedFile() imageFile?: Express.Multer.File, // Image is optional for update
  ) {
    if (Object.keys(updateProductImageDto).length === 0 && !imageFile) {
      throw new BadRequestException(
        'At least one field to update or a new image must be provided.',
      );
    }
    return this.productImageService.update(
      id,
      updateProductImageDto,
      imageFile,
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
