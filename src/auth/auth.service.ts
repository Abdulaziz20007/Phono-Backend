import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  OtpDto,
  UserJwtDto,
  AdminJwtDto,
} from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { generateOtp } from '../common/otp';
import { OtpService } from '../otp/otp.service';
import { phoneChecker } from '../common/phone';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_TIME) || 864000000,
  };

  userJwtGenerate(payload: UserJwtDto): object {
    const tokens = {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.USER_ACCESS,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.USER_REFRESH,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    };
    return tokens;
  }

  adminJwtGenerate(payload: AdminJwtDto): object {
    const tokens = {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ADMIN_ACCESS,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.ADMIN_REFRESH,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    };
    return tokens;
  }

  async sendOtp(phone: string) {
    if (!phoneChecker(phone)) {
      throw new BadRequestException("Noto'g'ri telefon raqam");
    }

    const user = await this.userService.findByPhone(phone);
    if (user?.is_active) {
      throw new BadRequestException('Bu nomer avval aktivlashtirilgan');
    }

    const oldOtp = await this.otpService.findByUserId(user?.id!);
    if (oldOtp) {
      await this.otpService.remove(oldOtp.id);
    }

    const otp = generateOtp() as OtpDto;
    await this.otpService.create({
      user_id: user?.id!,
      otp: otp.otp,
      expire: otp.expire,
      uuid: otp.uuid,
    });
    const response = {
      uuid: otp.uuid,
      expire: otp.expire,
    };
    return response;
  }

  async register(registerDto: RegisterDto) {
    if (!phoneChecker(registerDto.phone)) {
      throw new BadRequestException("Noto'g'ri telefon raqam");
    }
    const oldUser = await this.userService.findByPhone(registerDto.phone);
    if (oldUser) {
      throw new BadRequestException('Bu nomer avval ro`yhatdan otgan');
    }

    const password = registerDto.password.trim();
    if (password.length < 6) {
      throw new BadRequestException(
        'Parol kamida 6 ta belgidan iborat bo`lishi kerak',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const otp = generateOtp() as OtpDto;

    await this.otpService.create({
      user_id: newUser.id,
      otp: otp.otp,
      expire: otp.expire,
      uuid: otp.uuid,
    });

    const response = {
      uuid: otp.uuid,
      expire: otp.expire,
      phone: newUser.phone,
    };

    return response;
  }

  async verifyOtp(otpDto: OtpDto) {
    if (!phoneChecker(otpDto.phone)) {
      throw new BadRequestException("Noto'g'ri telefon raqam");
    }

    const otp = await this.otpService.findByUuid(otpDto.uuid);

    if (!otp) {
      throw new BadRequestException('Otp topilmadi');
    }

    if (otp.expire < new Date()) {
      throw new BadRequestException('Otp vaqti tugadi');
    }

    if (otp.otp !== otpDto.otp) {
      throw new BadRequestException('Otp noto`g`ri');
    }

    const user = await this.userService.findByPhone(otpDto.phone);
    if (!user) {
      throw new BadRequestException('User topilmadi');
    }

    if (user.id !== otp.user_id) {
      throw new BadRequestException('Telefon raqam mos kelmaydi');
    }

    if (user.is_active) {
      throw new BadRequestException('User allaqachon aktiv');
    }

    await this.userService.update(user.id, { is_active: true });

    const response = this.userJwtGenerate({
      id: user.id,
      phone: user.phone,
      is_active: user.is_active,
    });
    return response;
  }

  async login(loginDto: LoginDto, res?: Response) {
    if (!phoneChecker(loginDto.phone)) {
      throw new BadRequestException("Noto'g'ri telefon raqam");
    }

    const user = await this.userService.findByPhone(loginDto.phone);
    if (!user) {
      throw new UnauthorizedException('User topilmadi');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User aktiv emas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Noto'g'ri parol");
    }

    const tokens = this.userJwtGenerate({
      id: user.id,
      phone: user.phone,
      is_active: user.is_active,
    });

    if (res) {
      res.cookie('refreshToken', tokens['refresh_token'], this.COOKIE_OPTIONS);
      return { access_token: tokens['access_token'] };
    }

    return tokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, res?: Response) {
    try {
      const payload = await this.jwtService.verify(
        refreshTokenDto.refresh_token,
        {
          secret: process.env.USER_REFRESH,
        },
      );

      const user = await this.userService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User topilmadi');
      }

      if (!user.is_active) {
        throw new UnauthorizedException('User aktiv emas');
      }

      const tokens = this.userJwtGenerate({
        id: user.id,
        phone: user.phone,
        is_active: user.is_active,
      });

      if (res) {
        res.cookie(
          'refreshToken',
          tokens['refresh_token'],
          this.COOKIE_OPTIONS,
        );
        return { access_token: tokens['access_token'] };
      }

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Yaroqsiz refresh token');
    }
  }

  logout(res: Response) {
    res.clearCookie('refreshToken');
  }
}
