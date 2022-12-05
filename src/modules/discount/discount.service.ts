import { CategoryService } from '@app/category/category.service';
import { ProductService } from '@app/product/product.service';
import { ResponseTransfomer } from '@core/transform/response.transform';
import {
  DateTimeHelper,
  DATE_TIME,
  Filter,
  FilterSign,
  Sort,
} from '@eshopping/helper-package';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IFilterOptions } from 'src/common/interface/filter-options.interface';
import { IPaginationOptions } from 'src/common/interface/pagination-options.interface';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @Inject('DISCOUNT_REPOSITORY')
    private discountRepository: Repository<Discount>,

    private categoryService: CategoryService,
    private productService: ProductService,
  ) {}

  async findAll(
    filterOptions: IFilterOptions,
    paginationOptions: IPaginationOptions,
  ) {
    const { filter, search, sort } = filterOptions;
    const discountFilters = Filter.produce({ filter });
    const discountSorts = Sort.produce({ sort });
    const queryBuilder = this.discountRepository
      .createQueryBuilder('discount')
      .leftJoinAndSelect('discount.products', 'product');

    discountFilters.forEach((item, index) => {
      item.column = `discount.${item.column}`;
      queryBuilder.andWhere(`(${item.column}) ${item.sign} (:value${index})`, {
        [`value${index}`]:
          item.sign === FilterSign.$like ? `%${item.value}%` : item.value,
      });
    });

    if (search) {
      queryBuilder.andWhere('LOWER(discount.name) LIKE LOWER(:name)', {
        name: `%${search}%`,
      });
    }

    discountSorts.forEach((discountSort) => {
      queryBuilder.addOrderBy(
        `discount.${discountSort.sort}`,
        discountSort.order === 'ASC' ? 'ASC' : 'DESC',
      );
    });

    const discounts = await new ResponseTransfomer(
      queryBuilder,
    ).paginationResponseTransform(paginationOptions);
    return discounts;
  }

  async findOneById(
    id: number,
    relations: string[] = [
      'products',
      'products.category',
      'products.images',
      'products.productSizes',
    ],
  ) {
    const options = {
      where: { id },
      relations,
    };
    const discount = this.splitDayAndTime(
      await this.discountRepository.findOne(options),
    );

    if (!discount) {
      throw new NotFoundException(`Discount ${id} not found`);
    }

    return discount;
  }

  async createOne(createDiscountDto: CreateDiscountDto) {
    const {
      name,
      percent,
      fromDay,
      toDay,
      fromTime,
      toTime,
      productIds,
      categoryIds,
    } = createDiscountDto;

    if (this.isValidDate(fromDay, toDay)) {
      const newProductIds = await this.getProductIds(productIds, categoryIds);
      const products = await this.productService.findManyByIds(newProductIds);
      const options = {
        name,
        percent: percent / 100,
        startDate: DateTimeHelper.convertToUtc(
          fromDay.concat(' ', fromTime),
          DATE_TIME.DATE_FORMAT.DATE_TIME,
        ),
        endDate: DateTimeHelper.convertToUtc(
          toDay.concat(' ', toTime),
          DATE_TIME.DATE_FORMAT.DATE_TIME,
        ),
        products,
      };

      return this.discountRepository.save(options);
    }
  }

  async updateOne(id: number, updateDiscountDto: UpdateDiscountDto) {
    const {
      name,
      percent,
      fromDay,
      toDay,
      fromTime,
      toTime,
      productIds,
      categoryIds,
    } = updateDiscountDto;

    if (this.isValidDate(fromDay, toDay)) {
      const existedDiscount = await this.findOneById(id, ['products']);

      const newProductIds = await this.getProductIds(productIds, categoryIds);
      const products = await this.productService.findManyByIds(newProductIds);

      existedDiscount.name = name;
      existedDiscount.percent = percent / 100;
      existedDiscount.startDate = fromDay.concat(' ', fromTime);
      existedDiscount.endDate = toDay.concat(' ', toTime);
      existedDiscount.products = products;

      return this.discountRepository.save(existedDiscount);
    }
  }

  async deleteOne(id: number) {
    const discount = await this.findOneById(id);
    await this.discountRepository.delete(discount.id);
  }

  private isValidDate(fromDay: string, toDay: string) {
    const fromDateType = new Date(fromDay);
    const toDateType = new Date(toDay);

    if (fromDateType >= toDateType) {
      throw new BadRequestException('From day must be less than to day');
    }

    return fromDateType < toDateType;
  }

  private async getProductIds(productIds, categoryIds) {
    const products = [];
    const category = await this.categoryService.findManyByIds(categoryIds, [
      'products',
    ]);
    category.forEach((item) => {
      products.push(...item.products);
    });

    products.forEach((product) => {
      if (!productIds.includes(product.id)) {
        productIds.push(product.id);
      }
    });

    return productIds;
  }

  private splitDayAndTime(discount) {
    const [fromDay, fromTime] = DateTimeHelper.convertDateToDateByTimeZone(
      discount.startDate,
      '+07:00',
      DATE_TIME.DATE_FORMAT.DATE_TIME,
    ).split(' ');
    const [toDay, toTime] = DateTimeHelper.convertDateToDateByTimeZone(
      discount.endDate,
      '+07:00',
      DATE_TIME.DATE_FORMAT.DATE_TIME,
    ).split(' ');
    discount.fromDay = fromDay;
    discount.fromTime = fromTime;
    discount.toDay = toDay;
    discount.toTime = toTime;
    delete discount.startDate;
    delete discount.endDate;

    return discount;
  }
}
