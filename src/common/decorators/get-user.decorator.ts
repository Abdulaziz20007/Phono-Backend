import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from '../types/user.type';
import { AdminType } from '../types/admin.type';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserType | AdminType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
