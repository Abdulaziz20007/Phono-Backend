import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto, OtpDto } from './dto/auth.dto';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';

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
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(refreshTokenDto, res);
  }

  @Post('logout')
  @Public()
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Post('admin/login')
  @Public() 
  adminLogin(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.adminLogin(loginDto, res);
  }

  @Post('admin/refresh-token')
  @Public()
  adminRefreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminRefreshToken(refreshTokenDto, res);
  }
}
