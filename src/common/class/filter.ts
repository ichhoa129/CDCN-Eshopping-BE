import { BadRequestException } from '@nestjs/common';
import { FilterSign } from '../enums/filter.enum';

export class Filter {
  static produce({ filter }) {
    let listFilter = [];

    if (!filter || filter.length === 0) return listFilter;

    if (typeof filter === 'string') {
      listFilter.push(this.transform(filter));
      return listFilter;
    }

    if (typeof filter === 'object') {
      listFilter = filter.map((item) => this.transform(item));
    }

    return listFilter;
  }

  private static validator(filterItems) {
    if (filterItems.length !== 3) {
      return false;
    }

    if (!filterItems[0] || !filterItems[1] || !filterItems[2]) {
      return false;
    }

    if (!Object.keys(FilterSign).includes(filterItems[1])) {
      return false;
    }

    return true;
  }

  private static transform(filter) {
    const filterItems = filter.split('|');

    if (filter && !this.validator(filterItems)) {
      throw new BadRequestException('Invalid filter');
    }

    return {
      column: filterItems[0],
      sign: FilterSign[filterItems[1]],
      value: filterItems[2],
    };
  }
}
