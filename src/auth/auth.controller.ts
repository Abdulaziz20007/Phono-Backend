import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, OtpDto } from './dto/auth.dto';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('send-otp')
  @Public()
  sendOtp(@Body('phone') phone: string) {
    return this.authService.sendOtp(phone);
  }

  @Post('verify-otp')
  @Public()
  verifyOtp(@Body() otpDto: OtpDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.verifyOtp(otpDto, res);
  }

  @Post('login')
  @Public()
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(refreshToken, res);
  }

  @Post('logout')
  @Public()
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Post('admin/login')
  @Public()
  adminLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminLogin(loginDto, res);
  }

  @Post('admin/refresh-token')
  @Public()
  adminRefreshToken(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminRefreshToken(refreshToken, res);
  }
}
