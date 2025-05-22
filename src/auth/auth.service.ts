import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginDto,
  RegisterDto,
  OtpDto,
  UserJwtDto,
  AdminJwtDto,
} from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { generateOtp, sendOtp } from '../common/otp';
import { OtpService } from '../otp/otp.service';
import { phoneChecker } from '../common/phone';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { AdminService } from '../admin/admin.service';
import { PhoneService } from '../phone/phone.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly adminService: AdminService,
    private readonly phoneService: PhoneService,
  ) {}

  COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_TIME) || 864000000,
  };

  userJwtGenerate(payload: UserJwtDto): {
    accessToken: string;
    refreshToken: string;
  } {
    const tokens = {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.USER_ACCESS,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.USER_REFRESH,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    };
    return tokens;
  }

  adminJwtGenerate(payload: AdminJwtDto): {
    accessToken: string;
    refreshToken: string;
  } {
    const tokens = {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.ADMIN_ACCESS,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      refreshToken: this.jwtService.sign(payload, {
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

    sendOtp(user?.phone!, otp.otp);

    await this.otpService.create({
      user_id: user?.id!,
      otp: otp.otp,
      expire: otp.expire,
      uuid: otp.uuid,
    });

    const response = {
      uuid: otp.uuid,
      expire: otp.expire,
      phone: phone,
    };
    return response;
  }

  async register(registerDto: RegisterDto) {
    if (!phoneChecker(registerDto.phone)) {
      throw new BadRequestException("Noto'g'ri telefon raqam");
    }
    const oldUser = await this.userService.findByPhone(registerDto.phone);

    if (oldUser) {
      if (!oldUser.is_active) {
        await this.userService.remove(oldUser.id);
      } else {
        throw new BadRequestException('Bu nomer avval ro`yhatdan otgan');
      }
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

    await this.phoneService.create(
      { phone: newUser.phone },
      { user_id: newUser.id },
    );

    const otp = generateOtp() as OtpDto;

    sendOtp(newUser.phone, otp.otp);

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

  async verifyOtp(otpDto: OtpDto, res: Response) {
    if (!phoneChecker(otpDto.phone)) {
      throw new BadRequestException("Noto'g'ri telefon raqam");
    }

    const otp = await this.otpService.findByUuid(otpDto.uuid);

    if (!otp) {
      throw new BadRequestException('Otp topilmadi');
    }

    if (otp.expire < new Date()) {
      await this.otpService.remove(otp.id);
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
      await this.otpService.remove(otp.id);
      throw new BadRequestException('User allaqachon aktiv');
    }

    await this.userService.update(user.id, { is_active: true });

    await this.otpService.remove(otp.id);

    const { accessToken, refreshToken } = this.userJwtGenerate({
      id: user.id,
      phone: user.phone,
      is_active: user.is_active,
    });

    res.cookie('refreshToken', refreshToken, this.COOKIE_OPTIONS);

    return { accessToken };
  }

  async login(loginDto: LoginDto, res?: Response) {
    if (!phoneChecker(loginDto.phone)) {
      throw new BadRequestException("Telefon raqam yoki parol noto'g'ri");
    }

    const user = await this.userService.findByPhone(loginDto.phone);

    if (!user) {
      throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
    }

    if (
      user.blocks &&
      user.blocks.some((block) => block.expire_date > new Date())
    ) {
      throw new UnauthorizedException(`User bloklangan`);
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User aktiv emas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
    }

    const tokens = this.userJwtGenerate({
      id: user.id,
      phone: user.phone,
      is_active: user.is_active,
    });

    if (res) {
      res.cookie('refreshToken', tokens['refreshToken'], this.COOKIE_OPTIONS);
      return { accessToken: tokens['accessToken'] };
    }

    return tokens;
  }

  async refreshToken(refreshToken: string, res: Response) {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.USER_REFRESH,
      });

      const user = await this.userService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User topilmadi');
      }

      if (
        user.blocks &&
        user.blocks.some((block) => block.expire_date > new Date())
      ) {
        throw new UnauthorizedException(`User bloklangan`);
      }

      if (!user.is_active) {
        throw new UnauthorizedException('User aktiv emas');
      }

      const tokens = this.userJwtGenerate({
        id: user.id,
        phone: user.phone,
        is_active: user.is_active,
      });

      res.cookie('refreshToken', tokens['refreshToken'], this.COOKIE_OPTIONS);
      return { accessToken: tokens['accessToken'] };
    } catch (error) {
      throw new UnauthorizedException('Yaroqsiz refresh token');
    }
  }

  logout(res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Tizimdan chiqildi' };
  }

  async adminLogin(loginDto: LoginDto, res?: Response) {
    const admin = await this.adminService.findAdminByPhone(loginDto.phone);
    if (!admin) {
      throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
    }

    const tokens = this.adminJwtGenerate({
      id: admin.id,
      phone: admin.phone,
    });

    if (res) {
      res.cookie('refreshToken', tokens.refreshToken, this.COOKIE_OPTIONS);
      return { accessToken: tokens.accessToken };
    }

    return tokens;
  }

  async adminRefreshToken(refreshToken: string, res: Response) {
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.ADMIN_REFRESH,
      });

      const admin = await this.adminService.findOne(payload.id);
      if (!admin) {
        throw new UnauthorizedException('Admin topilmadi');
      }

      const tokens = this.adminJwtGenerate({
        id: admin.id,
        phone: admin.phone,
      });

      if (res) {
        res.cookie('refreshToken', tokens.refreshToken, this.COOKIE_OPTIONS);
        return { accessToken: tokens.accessToken };
      }

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Yaroqsiz refresh token');
    }
  }
}
