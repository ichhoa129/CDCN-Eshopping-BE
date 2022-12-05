import { CategoryService } from '@app/category/category.service';
import { ProductSize } from '@app/product_size/product_size.entity';
import { ProductSizeService } from '@app/product_size/product_size.service';
import { SizeService } from '@app/size/size.service';
import { ResponseTransfomer } from '@core/transform/response.transform';
import { Filter, FilterSign, Sort } from '@eshopping/helper-package';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_STATUS } from 'src/common/enums/product.enum';
import { IFilterOptions } from 'src/common/interface/filter-options.interface';
import { IPaginationOptions } from 'src/common/interface/pagination-options.interface';
import { convertToSlug } from 'src/common/utils/slug';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,

    @Inject('PRODUCT_SIZE_REPOSITORY')
    private productSizeRepository: Repository<ProductSize>,

    private categoryService: CategoryService,
  ) {}

  async findAll(
    filterOptions: IFilterOptions,
    paginationOptions: IPaginationOptions,
  ) {
    const { filter, search, sort } = filterOptions;
    const productFilters = Filter.produce({ filter });
    const productSorts = Sort.produce({ sort });

    const queryBuilder = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.productSizes', 'productSizes')
      .leftJoinAndSelect('productSizes.size', 'size');

    productFilters.forEach((item, index) => {
      item.column =
        item.column === 'category'
          ? `${item.column}.name`
          : `products.${item.column}`;

      queryBuilder.andWhere(
        `LOWER(${item.column}) ${item.sign} LOWER(:value${index})`,
        {
          [`value${index}`]:
            item.sign === FilterSign.$like ? `%${item.value}%` : item.value,
        },
      );
    });

    if (search) {
      queryBuilder.andWhere('LOWER(products.name) LIKE LOWER(:name)', {
        name: `%${search}%`,
      });
    }

    productSorts.forEach((productSort) => {
      queryBuilder.addOrderBy(
        `products.${productSort.sort}`,
        productSort.order === 'ASC' ? 'ASC' : 'DESC',
      );
    });

    return new ResponseTransfomer(queryBuilder).paginationResponseTransform(
      paginationOptions,
    );
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const options = {
      where: { slug },
      relations: ['category', 'productSizes', 'productSizes.size', 'discount'],
    };
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async findOneById(id: number, relations: string[] = []): Promise<Product> {
    const options = {
      where: { id },
      relations,
    };
    const product = await this.productRepository.findOne(options);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findManyByIds(
    ids: number[],
    relations: string[] = [],
  ): Promise<Product[]> {
    return this.productRepository.find({
      where: { id: In(ids) },
      relations,
    });
  }

  async createOne(createProductDto: CreateProductDto): Promise<void> {
    const { name, description, price, unit, categoryId, sizes } =
      createProductDto;

    await this.productRepository.manager.transaction(async (manager) => {
      const product = new Product();
      product.name = name;
      product.slug = convertToSlug(name);
      product.description = description;
      product.price = price;
      product.unit = unit;
      product.status = PRODUCT_STATUS.ACTIVE;
      product.categoryId = categoryId;
      product.stock = 0;

      const createdProduct = await manager.save(Product, product);

      let totalStock = 0;
      const productSizes = sizes.map((size) => {
        totalStock += size.quantity;
        return {
          productId: createdProduct.id,
          ...size,
        };
      });

      createdProduct.stock = totalStock;

      await manager.save(ProductSize, productSizes);
      await manager.save(Product, createdProduct);
    });
  }

  async updateOne(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    const { name, description, price, unit, status, categoryId, sizes } =
      updateProductDto;

    const product = new Product();
    product.name = name;
    product.slug = convertToSlug(name);
    product.description = description;
    product.price = price;
    product.unit = unit;
    product.status = status;
    product.category = await this.categoryService.findOneById(categoryId);
    product.stock = 0;

    const productSizes = sizes.map((size) => {
      product.stock += size.quantity;

      return {
        productId: id,
        ...size,
      };
    });

    await this.productSizeRepository.upsert(productSizes, [
      'productId',
      'sizeId',
    ]);
    await this.productRepository.update(id, product);
  }

  async deleteOne(id: number): Promise<void> {
    const product = await this.findOneById(id);
    await this.productRepository.delete(product.id);
  }
}