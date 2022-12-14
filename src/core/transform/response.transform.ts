import { Pagination } from '@eshopping/helper-package';
import { IPaginationOptions } from 'src/common/interface/pagination-options.interface';

export class ResponseTransfomer {
  private queryBuilder;

  constructor(queryBuilder) {
    this.queryBuilder = queryBuilder;
  }

  async paginationResponseTransform(paginationOptions: IPaginationOptions) {
    const pagination = Pagination.produce(paginationOptions);

    const itemsQuery = await this.queryBuilder;
    if (!paginationOptions.all) {
      itemsQuery.take(pagination.limit).skip(pagination.offset);
    }
    const items = await itemsQuery.getMany();
    const totalItems = await this.queryBuilder.getCount();
    const meta = {
      totalItems,
      itemCount: itemsQuery.length,
      itemsPerPage: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
      currentPage: pagination.page,
    };
    return { items, meta };
  }
}
