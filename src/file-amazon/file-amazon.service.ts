import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class FileAmazonService {
  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
  private s3Client = new S3Client({
    region: process.env.AWS_REGION, // ✅ Regionni to‘g‘ri belgilang
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadFile(file: Express.Multer.File) {

    if (!file) {
      return;
    }

    const uploadParams = {
      Bucket: this.AWS_S3_BUCKET,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await this.s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${this.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.originalname}`;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new InternalServerErrorException(
        "File yuklashda xatolik ro'y berdi"
      );
    }
  }
}
