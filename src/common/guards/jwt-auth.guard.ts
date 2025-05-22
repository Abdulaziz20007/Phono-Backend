import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Kirish tokeni topilmadi');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.USER_ACCESS,
      });

      request.user = {
        id: payload.id,
        name: payload.name,
        surname: payload.surname,
        phone: payload.phone,
        is_active: payload.is_active,
        role: 'USER',
      };

      return true;
    } catch (error) {
      try {
        const adminPayload = await this.jwtService.verify(token, {
          secret: process.env.ADMIN_ACCESS,
        });

        request.user = {
          id: adminPayload.id,
          name: adminPayload.name,
          surname: adminPayload.surname,
          phone: adminPayload.phone,
          is_creator: adminPayload.is_creator,
          role: 'ADMIN',
        };

        return true;
      } catch (adminError) {
        throw new UnauthorizedException('Yaroqsiz token');
      }
    }
  }
}
