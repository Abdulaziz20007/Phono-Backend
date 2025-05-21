import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from "@nestjs/common";
import { PaymentMethodService } from "./payment-method.service";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { NoFilesInterceptor } from "@nestjs/platform-express";

@Controller("payment-method")
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor()) // form-data ni parse qilish uchun
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    console.log(
      "--- Form Data Request Inside Create Controller (with NoFilesInterceptor) ---"
    );
    console.log("Received DTO for create:", createPaymentMethodDto);
    console.log(
      "Is DTO instance of CreatePaymentMethodDto:",
      createPaymentMethodDto instanceof CreatePaymentMethodDto
    );
    return this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Get()
  findAll() {
    return this.paymentMethodService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.paymentMethodService.findOne(+id);
  }

  @Patch(":id")
  @UseInterceptors(NoFilesInterceptor()) // <--- QO'SHILDI: form-data ni parse qilish uchun
  update(
    @Param("id") id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto
  ) {
    console.log(
      "--- Form Data Request Inside Update Controller (with NoFilesInterceptor) ---"
    );
    console.log("Received DTO for update:", updatePaymentMethodDto);
    console.log(
      "Is DTO instance of UpdatePaymentMethodDto:",
      updatePaymentMethodDto instanceof UpdatePaymentMethodDto // UpdatePaymentMethodDto ni tekshiring
    );
    return this.paymentMethodService.update(+id, updatePaymentMethodDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    // Bu metod odatda body qabul qilmaydi, shuning uchun interceptor shart emas.
    // Agar body qabul qiladigan bo'lsa, unda @UseInterceptors(NoFilesInterceptor()) va @Body() qo'shilishi kerak.
    return this.paymentMethodService.remove(+id);
  }
}
