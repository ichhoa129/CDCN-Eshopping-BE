import { ResponseTransfomer } from '@core/transform/response.transform';
import { Filter, Sort } from '@eshopping/helper-package';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFilterOptions } from 'src/common/interface/filter-options.interface';
import { IPaginationOptions } from 'src/common/interface/pagination-options.interface';
import { Repository } from 'typeorm';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './size.entity';

@Injectable()
export class SizeService {
  constructor(
    @Inject('SIZE_REPOSITORY')
    private sizeRepository: Repository<Size>,
  ) {}

  async findAll(
    filterOptions: IFilterOptions,
    paginationOptions: IPaginationOptions,
  ) {
    const { filter, search, sort } = filterOptions;
    const sizeFilters = Filter.produce({ filter });
    const sizeSorts = Sort.produce({ sort });
    const queryBuilder = this.sizeRepository.createQueryBuilder('sizes');

    if (search) {
      queryBuilder.andWhere('name LIKE :name', {
        name: `%${search}%`,
      });
    }

    sizeSorts.forEach((sizeSort) => {
      queryBuilder.addOrderBy(
        `sizes.${sizeSort.sort}`,
        sizeSort.order === 'ASC' ? 'ASC' : 'DESC',
      );
    });

    return new ResponseTransfomer(queryBuilder).paginationResponseTransform(
      paginationOptions,
    );
  }

  async findOneById(id: number): Promise<Size> {
    const size = await this.sizeRepository.findOneBy({ id });

    if (!size) {
      throw new NotFoundException('Size not found');
    }

    return size;
  }

  async createOne(createSizeDto: CreateSizeDto): Promise<void> {
    const { name } = createSizeDto;

    const size = new Size();
    size.name = name;

    await this.sizeRepository.insert(size);
  }

  async updateOne(id: number, updateSizeDto: UpdateSizeDto): Promise<void> {
    const { name } = updateSizeDto;

    const size = await this.findOneById(id);
    size.name = name;

    await this.sizeRepository.update(size.id, size);
  }

  async deleteOne(id: number): Promise<void> {
    const size = await this.findOneById(id);
    await this.sizeRepository.delete(size.id);
  }
}
