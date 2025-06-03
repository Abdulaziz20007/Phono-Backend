import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

@Injectable()
export class FileAmazonService {
  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
  private s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      return;
    }

    const fileName = uuidv4();

    const uploadParams = {
      Bucket: this.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await this.s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${this.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException(
        "File yuklashda xatolik ro'y berdi",
      );
    }
  }

  async deleteFile(fileUrl: string) {
    try {
      // Extract the key from the URL
      // URL format: https://bucket-name.s3.region.amazonaws.com/file-key
      const urlParts = fileUrl.split('/');
      const key = urlParts[urlParts.length - 1];

      const deleteParams = {
        Bucket: this.AWS_S3_BUCKET,
        Key: key,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      return true;
    } catch (error) {
      console.error('S3 Delete Error:', error);
      throw new InternalServerErrorException(
        "File o'chirishda xatolik ro'y berdi",
      );
    }
  }
}
