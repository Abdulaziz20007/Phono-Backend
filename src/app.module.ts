import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { PhoneModule } from './phone/phone.module';
import { EmailModule } from './email/email.module';
import { AddressModule } from './address/address.module';
import { FavouriteItemModule } from './favourite-item/favourite-item.module';
import { ProductImageModule } from './product-image/product-image.module';
import { BrandModule } from './brand/brand.module';
import { ModelModule } from './model/model.module';
import { ColorModule } from './color/color.module';
import { CurrencyModule } from './currency/currency.module';
import { AdminModule } from './admin/admin.module';
import { BlockModule } from './block/block.module';
import { PaymentModule } from './payment/payment.module';
import { CommentModule } from './comment/comment.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductModule,
    UserModule,
    OtpModule,
    PhoneModule,
    EmailModule,
    AddressModule,
    FavouriteItemModule,
    ProductImageModule,
    BrandModule,
    ModelModule,
    ColorModule,
    CurrencyModule,
    AdminModule,
    BlockModule,
    PaymentModule,
    CommentModule,
    PaymentMethodModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
