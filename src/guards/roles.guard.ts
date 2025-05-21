import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../common/enums/roles.enum';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Check for SUPERADMIN role
    if (requiredRoles.includes(Role.SUPERADMIN)) {
      return user.is_creator === true;
    }

    // For ADMIN role, check if user is admin
    if (requiredRoles.includes(Role.ADMIN)) {
      return user.role === Role.ADMIN;
    }

    // For USER role, check if user is user
    if (requiredRoles.includes(Role.USER)) {
      return user.role === Role.USER;
    }

    return false;
  }
}
