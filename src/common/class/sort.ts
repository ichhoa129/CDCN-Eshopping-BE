import { SortDirection } from '../enums/sort.enum';

export class Sort {
  static produce({ sort }) {
    let listSort = [];

    if (!sort || sort.length === 0) return listSort;

    if (typeof sort === 'string') {
      listSort.push(this.transform(sort));
      return listSort;
    }

    if (typeof sort === 'object') {
      listSort = sort.map((item) => this.transform(item));
    }

    return listSort;
  }

  static transform(sort = '') {
    const sortSchema = {
      sort: '',
      order: SortDirection['-'],
    };
    const signCharacter = sort[0];
    const isDescendingDirection =
      SortDirection[signCharacter] === SortDirection['-'];

    if (isDescendingDirection) {
      sortSchema.sort = sort.slice(1, sort.length);
      return sortSchema;
    }

    sortSchema.sort = sort;
    sortSchema.order = SortDirection['+'];

    return sortSchema;
  }
}
