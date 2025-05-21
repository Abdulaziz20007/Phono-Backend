export class CreateOtpDto {
  user_id: number;
  otp: string;
  expire: Date;
  uuid: string;
}
