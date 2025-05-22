import { ForbiddenException } from '@nestjs/common';

export const selfGuard = (user_id: number, item: { user_id: number }) => {
  if (user_id !== item.user_id) {
    throw new ForbiddenException(
      "Siz bu ma`lumotni o'zgartirishga ruxsat berilmagan",
    );
  }
};
