import { BadRequestException } from '@nestjs/common';
import { PAGINATION } from '../constants/pagination.constant';

export class Pagination {
  private static MAX_PAGE = PAGINATION.MAX_PAGE;
  private static MAX_LIMIT = PAGINATION.MAX_LIMIT;
  private static DEFAULT_PAGE = PAGINATION.DEFAULT_PAGE;
  private static DEFAULT_LIMIT = PAGINATION.MAX_LIMIT;

  static produce({ page, limit }) {
    let parsedPage = Number.parseInt(page);
    let parsedLimit = Number.parseInt(limit);

    if (Number.isNaN(parsedPage)) {
      parsedPage = Pagination.DEFAULT_PAGE;
      parsedPage = Pagination.DEFAULT_LIMIT;
    } else if (parsedPage > Pagination.MAX_PAGE) {
      throw new BadRequestException('Page reach max');
    }

    if (Number.isNaN(parsedLimit)) {
      parsedLimit = Pagination.DEFAULT_LIMIT;
    } else if (parsedLimit > Pagination.MAX_LIMIT) {
      throw new BadRequestException('Limit reach max');
    }

    return {
      page: parsedPage,
      limit: parsedLimit,
      offset: (parsedPage - 1) * parsedLimit,
    };
  }
}
