import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface IPagination {
  page?: number;
  size?: number;
  offset: number;
  limit: number;
}
export const PaginationParams = createParamDecorator(
  (data: string, ctx: ExecutionContext): IPagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    let page = parseInt(req.query.page as string);
    let size = parseInt(req.query.size as string);

    if (isNaN(page)) {
      page = 1;
    }

    if (isNaN(size)) {
      size = 10;
    }

    if (page < 0 || size < 0) {
      throw new BadRequestException('Invalid pagination params');
    }

    if (size > 50) {
      throw new BadRequestException(
        'Invalid pagination params: Max size is 50',
      );
    }

    const limit = size;
    const offset = (page - 1) * limit;
    return { limit, offset };
  },
);
