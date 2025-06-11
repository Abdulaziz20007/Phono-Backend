import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed
import { FileAmazonService } from '../file-amazon/file-amazon.service'; // Adjust path if needed
import { Express } from 'express';
import { ProductImage, Prisma } from '@prisma/client';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileAmazonService: FileAmazonService, // Ensure this service has uploadFile and deleteFile
  ) {}

  // Helper method to reset the ProductImage ID sequence
  private async resetProductImageSequence() {
    try {
      // Find the maximum ID in the ProductImage table
      const result = await this.prisma.$queryRaw<
        Array<{ max_id: number | null }>
      >`
        SELECT MAX(id) as max_id FROM "ProductImage"
      `;
      const maxId = result[0]?.max_id || 0;

      // Reset the sequence to max_id + 1
      await this.prisma.$executeRaw`
        SELECT setval('"ProductImage_id_seq"', ${maxId + 1}, false)
      `;

      console.log(`Reset ProductImage ID sequence to ${maxId + 1}`);
    } catch (error) {
      console.error('Error resetting ProductImage ID sequence:', error);
      // Non-critical error, continue with operation
    }
  }

  async create(
    createProductImageDto: CreateProductImageDto,
    imageFiles: Express.Multer.File[],
  ) {
    // Reset sequence before creating new records
    await this.resetProductImageSequence();

    if (!imageFiles || imageFiles.length === 0) {
      throw new BadRequestException(
        'At least one product image file is required.',
      );
    }

    const uploadedImages: ProductImage[] = [];
    const uploadedUrls: string[] = [];

    try {
      // If is_main is true, set other images for the same product_id to is_main = false
      if (createProductImageDto.is_main === true) {
        await this.prisma.productImage.updateMany({
          where: {
            product_id: createProductImageDto.product_id,
            is_main: true,
          },
          data: {
            is_main: false,
          },
        });
      }

      // Upload all images and create records in a transaction
      await this.prisma.$transaction(async (prismaTransaction) => {
        // Upload all files first
        for (const imageFile of imageFiles) {
          try {
            const imageUrl = await this.fileAmazonService.uploadFile(imageFile);
            if (!imageUrl) {
              throw new InternalServerErrorException(
                'File upload succeeded but no URL was returned.',
              );
            }
            uploadedUrls.push(imageUrl);
          } catch (uploadError: any) {
            console.error('Error uploading product image to S3:', uploadError);
            throw new InternalServerErrorException(
              uploadError.message || 'Could not upload product image.',
            );
          }
        }

        // Determine which image will be the main one (the first one if is_main is true)
        let isFirstImage = true;

        // Create database records for all uploaded images
        for (const imageUrl of uploadedUrls) {
          // Only set the first image as main if is_main is true
          const isMain = createProductImageDto.is_main && isFirstImage;
          if (isFirstImage) {
            isFirstImage = false;
          }

          const productImage = await prismaTransaction.productImage.create({
            data: {
              url: imageUrl,
              product_id: createProductImageDto.product_id,
              is_main: isMain,
            },
          });
          uploadedImages.push(productImage);
        }
      });

      return uploadedImages;
    } catch (error: any) {
      console.error('Error while creating product image records:', error);

      // Attempt to delete any uploaded files if DB operation fails
      for (const imageUrl of uploadedUrls) {
        try {
          await this.fileAmazonService.deleteFile(imageUrl);
          console.log(`Orphaned S3 file ${imageUrl} deleted after DB error.`);
        } catch (deleteError) {
          console.error(
            `Failed to delete orphaned S3 file ${imageUrl}:`,
            deleteError,
          );
        }
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          // Foreign key constraint failed
          throw new BadRequestException(
            `Product with ID ${createProductImageDto.product_id} does not exist.`,
          );
        }
        if (
          error.code === 'P2002' &&
          Array.isArray(error.meta?.target) &&
          error.meta.target.includes('id')
        ) {
          throw new BadRequestException(
            'A conflict occurred with the image ID. Please try again.',
          );
        }
      }
      throw new InternalServerErrorException({
        message: error.message || 'Could not create product image records',
      });
    }
  }

  async findAll(productId?: number) {
    return this.prisma.productImage.findMany({
      where: productId ? { product_id: productId } : {},
    });
  }

  async findOne(id: number) {
    const productImage = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!productImage) {
      throw new NotFoundException(`ProductImage with ID ${id} not found`);
    }
    return productImage;
  }

  async update(
    id: number,
    updateProductImageDto: UpdateProductImageDto,
    imageFiles?: Express.Multer.File[],
  ) {
    const existingProductImage = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!existingProductImage) {
      throw new NotFoundException(`ProductImage with ID ${id} not found`);
    }

    const dataToUpdate: Prisma.ProductImageUpdateInput = {};
    let newImageUrl: string | undefined = undefined;
    const oldImageUrl = existingProductImage.url;

    // Handle a single image update for the existing product image
    if (imageFiles && imageFiles.length > 0) {
      try {
        // We only update the first image for the existing record
        newImageUrl = await this.fileAmazonService.uploadFile(imageFiles[0]);
        if (!newImageUrl) {
          throw new InternalServerErrorException(
            'File upload for update succeeded but no URL was returned.',
          );
        }
        dataToUpdate.url = newImageUrl;
      } catch (uploadError: any) {
        console.error('Error uploading new product image to S3:', uploadError);
        throw new InternalServerErrorException(
          uploadError.message || 'Could not upload new product image.',
        );
      }

      // If there are additional images, create new records for them
      if (imageFiles.length > 1) {
        this.createAdditionalImages(
          existingProductImage.product_id,
          imageFiles.slice(1),
          updateProductImageDto.is_main === true ? false : undefined,
        );
      }
    }

    if (updateProductImageDto.is_main !== undefined) {
      dataToUpdate.is_main = updateProductImageDto.is_main;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new BadRequestException('No data provided for update.');
    }

    try {
      // If setting this image to is_main = true, ensure others for the same product are false
      if (dataToUpdate.is_main === true && existingProductImage.product_id) {
        await this.prisma.productImage.updateMany({
          where: {
            product_id: existingProductImage.product_id,
            id: { not: id },
            is_main: true,
          },
          data: {
            is_main: false,
          },
        });
      }

      const updatedProductImage = await this.prisma.productImage.update({
        where: { id },
        data: dataToUpdate,
      });

      // If update was successful, a new image was uploaded, and it's different from old, delete the old one
      if (newImageUrl && oldImageUrl && newImageUrl !== oldImageUrl) {
        try {
          await this.fileAmazonService.deleteFile(oldImageUrl);
        } catch (deleteError) {
          console.error(
            `Failed to delete old product image ${oldImageUrl} from S3:`,
            deleteError,
          );
          // Non-critical error, log and continue
        }
      }
      return updatedProductImage;
    } catch (error: any) {
      console.error('Error while updating product image:', error);
      // If DB update failed but a new file was uploaded, try to delete the new (now orphaned) file
      if (newImageUrl) {
        try {
          await this.fileAmazonService.deleteFile(newImageUrl);
          console.log(
            `Orphaned new S3 file ${newImageUrl} deleted after DB error during update.`,
          );
        } catch (deleteError) {
          console.error(
            `Failed to delete orphaned new S3 file ${newImageUrl}:`,
            deleteError,
          );
        }
      }
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: error.message || 'Could not update product image',
      });
    }
  }

  // Helper method to create additional images for a product
  private async createAdditionalImages(
    productId: number,
    imageFiles: Express.Multer.File[],
    isMain?: boolean,
  ) {
    const uploadedUrls: string[] = [];
    try {
      // Upload all files first
      for (const imageFile of imageFiles) {
        try {
          const imageUrl = await this.fileAmazonService.uploadFile(imageFile);
          if (!imageUrl) {
            throw new InternalServerErrorException(
              'File upload succeeded but no URL was returned.',
            );
          }
          uploadedUrls.push(imageUrl);
        } catch (uploadError: any) {
          console.error(
            'Error uploading additional product image to S3:',
            uploadError,
          );
          throw new InternalServerErrorException(
            uploadError.message || 'Could not upload additional product image.',
          );
        }
      }

      // Create database records for all uploaded images
      const createdImages = await this.prisma.$transaction(
        uploadedUrls.map((url) =>
          this.prisma.productImage.create({
            data: {
              url,
              product_id: productId,
              is_main: isMain || false,
            },
          }),
        ),
      );

      return createdImages;
    } catch (error: any) {
      console.error(
        'Error while creating additional product image records:',
        error,
      );

      // Attempt to delete any uploaded files if DB operation fails
      for (const imageUrl of uploadedUrls) {
        try {
          await this.fileAmazonService.deleteFile(imageUrl);
          console.log(
            `Orphaned additional S3 file ${imageUrl} deleted after DB error.`,
          );
        } catch (deleteError) {
          console.error(
            `Failed to delete orphaned additional S3 file ${imageUrl}:`,
            deleteError,
          );
        }
      }

      throw new InternalServerErrorException({
        message:
          error.message || 'Could not create additional product image records',
      });
    }
  }

  async remove(id: number) {
    const existingProductImage = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!existingProductImage) {
      throw new NotFoundException(`ProductImage with ID ${id} not found`);
    }

    try {
      await this.prisma.productImage.delete({ where: { id } });

      // If DB deletion was successful, delete the file from S3
      if (existingProductImage.url) {
        try {
          await this.fileAmazonService.deleteFile(existingProductImage.url);
        } catch (deleteError) {
          console.error(
            `Failed to delete product image ${existingProductImage.url} from S3:`,
            deleteError,
          );
          // Non-critical for the client response, but should be logged
        }
      }
      return { message: `ProductImage with ID ${id} deleted successfully` };
    } catch (error: any) {
      console.error('Error while deleting product image:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: error.message || 'Could not delete product image',
      });
    }
  }

  // Helper to set a specific image as main, and others as not main for a product
  async setMainImage(productImageId: number) {
    const imageToSetMain = await this.prisma.productImage.findUnique({
      where: { id: productImageId },
    });

    if (!imageToSetMain) {
      throw new NotFoundException(
        `ProductImage with ID ${productImageId} not found.`,
      );
    }

    // Start a transaction
    return this.prisma.$transaction(async (prismaTx) => {
      // Renamed prisma to prismaTx for clarity in transaction
      // Set all other images for this product to is_main = false
      await prismaTx.productImage.updateMany({
        where: {
          product_id: imageToSetMain.product_id,
          id: { not: productImageId }, // Exclude the current image
          is_main: true,
        },
        data: {
          is_main: false,
        },
      });

      // Set the specified image to is_main = true
      const updatedImage = await prismaTx.productImage.update({
        where: { id: productImageId },
        data: { is_main: true },
      });
      return updatedImage;
    });
  }

  // Public method for resetting the ProductImage ID sequence
  async resetSequence() {
    await this.resetProductImageSequence();
    return { message: 'ProductImage ID sequence reset successfully' };
  }
}
