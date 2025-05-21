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
import { ApiConsumes, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger'; // ApiBody for DTO + file
import { Express } from 'express';

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

@ApiTags('Product Image')
@Controller('product-images') // Changed to plural and kebab-case for RESTful convention
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      // 'image' must match the key in CreateProductImageDto for Swagger
      fileFilter: imageFileFilter,
      limits: imageUploadLimits,
    }),
  )
  @ApiBody({ type: CreateProductImageDto }) // Helps Swagger understand the DTO fields alongside the file
  create(
    @Body() createProductImageDto: CreateProductImageDto,
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
  @ApiQuery({
    name: 'productId',
    required: false,
    type: Number,
    description: 'Filter images by product ID',
  })
  findAll(
    @Query('productId', new ParseIntPipe({ optional: true }))
    productId?: number,
  ) {
    return this.productImageService.findAll(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      // 'image' must match the key in UpdateProductImageDto
      fileFilter: imageFileFilter,
      limits: imageUploadLimits,
    }),
  )
  @ApiBody({ type: UpdateProductImageDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductImageDto: UpdateProductImageDto,
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
  setMainImage(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.setMainImage(id);
  }

  @Delete(':id')
  @HttpCode(204) // No Content for successful deletion
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productImageService.remove(id);
    // No content returned, so no explicit return statement needed for data
  }
}
