import { ResponseTransfomer } from '@core/transform/response.transform';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Sort } from 'src/common/class/sort';
import { IFilterOptions } from 'src/common/interface/filter-options.interface';
import { IPaginationOptions } from 'src/common/interface/pagination-options.interface';
import { In, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    filterOptions: IFilterOptions,
    paginationOptions: IPaginationOptions,
  ) {
    const { search, sort } = filterOptions;
    const categorySorts = Sort.produce({ sort });
    const queryBuilder =
      this.categoryRepository.createQueryBuilder('categories');

    if (search) {
      queryBuilder.andWhere('LOWER(name) LIKE LOWER(:name)', {
        name: `%${search}%`,
      });
    }

    categorySorts.forEach((categorySort) => {
      queryBuilder.addOrderBy(
        `categories.${categorySort.sort}`,
        categorySort.order === 'ASC' ? 'ASC' : 'DESC',
      );
    });

    return new ResponseTransfomer(queryBuilder).paginationResponseTransform(
      paginationOptions,
    );
  }

  async findOneById(id: number): Promise<Category> {
    const options = {
      where: {
        id,
      },
      relations: ['products'],
    };

    const category = await this.categoryRepository.findOne(options);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findManyByIds(
    ids: number[],
    relations: string[] = [],
  ): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        id: In(ids),
      },
      relations,
    });
  }

  async createOne(createCategoryDto: CreateCategoryDto): Promise<void> {
    const { name } = createCategoryDto;

    const category = new Category();
    category.name = name;

    await this.categoryRepository.insert(category);
  }

  async updateOne(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const { name } = updateCategoryDto;

    const category = await this.findOneById(id);
    category.name = name;

    await this.categoryRepository.update(category.id, category);
  }

  async deleteOne(id: number): Promise<void> {
    const category = await this.findOneById(id);
    await this.categoryRepository.delete(category.id);
  }
}
