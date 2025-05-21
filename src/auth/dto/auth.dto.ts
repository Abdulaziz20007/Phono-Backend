import { CreateUserDto } from '../../user/dto/create-user.dto';

export class RegisterDto extends CreateUserDto {}

export class LoginDto {
  phone: string;
  password: string;
}

export class RefreshTokenDto {
  refresh_token: string;
}

export class OtpDto {
  otp: string;
  uuid: string;
  expire: Date;
  phone: string;
}

export class UserJwtDto {
  id: number;
  phone: string;
  is_active: boolean;
}

export class AdminJwtDto {
  id: number;
  phone: string;
  is_creator: boolean;
}
