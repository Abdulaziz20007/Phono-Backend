import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInAdminDto {
  @IsEmail()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
