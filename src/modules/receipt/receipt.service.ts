import { ProductSize } from '@app/product_size/product_size.entity';
import { ResponseTransfomer } from '@core/transform/response.transform';
import { Filter, Sort } from '@eshopping/helper-package';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFilterOptions } from 'src/common/interface/filter-options.interface';
import { IPaginationOptions } from 'src/common/interface/pagination-options.interface';
import { In, Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { Receipt, ReceiptProduct } from './receipt.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @Inject('RECEIPT_REPOSITORY')
    private receiptRepository: Repository<Receipt>,

    @Inject('PRODUCT_SIZE_REPOSITORY')
    private productSizeRepository: Repository<ProductSize>,
  ) {}

  async findAll(
    filterOptions: IFilterOptions,
    paginationOptions: IPaginationOptions,
  ) {
    const { filter, search, sort } = filterOptions;
    const receiptFilters = Filter.produce({ filter });
    const receiptSorts = Sort.produce({ sort });
    const queryBuilder = this.receiptRepository
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.receiptProducts', 'receiptProducts')
      .leftJoinAndSelect('receiptProducts.productSize', 'productSize')
      .leftJoinAndSelect('productSize.size', 'size')
      .leftJoinAndSelect('productSize.product', 'product');

    if (receiptSorts.length) {
      receiptSorts.forEach((receiptSort) => {
        queryBuilder.addOrderBy(
          `receipt.${receiptSort.sort}`,
          receiptSort.order === 'ASC' ? 'ASC' : 'DESC',
        );
      });
    } else {
      queryBuilder.addOrderBy('receipt.createdAt', 'DESC');
    }

    return new ResponseTransfomer(queryBuilder).paginationResponseTransform(
      paginationOptions,
    );
  }

  async createOne(createReceiptDto: CreateReceiptDto) {
    const { products, note } = createReceiptDto;
    const productSizeIds = products.map((product) => product.productSizeId);
    const foundProductSizes = await this.productSizeRepository.find({
      where: { id: In(productSizeIds) },
      relations: ['product'],
    });

    await this.receiptRepository.manager.transaction(async (manager) => {
      const receipt = new Receipt();

      receipt.note = note;
      receipt.total = 0;

      const createdReceipt = await manager.save(Receipt, receipt);
      const receiptProducts = [];
      const productSizes = [];
      const productsInStock = [];

      products.forEach((product) => {
        const foundProductItem = foundProductSizes.find(
          (item) => item.id === product.productSizeId,
        );

        if (!foundProductItem) {
          throw new NotFoundException(
            `Product size with id ${product.productSizeId} not found`,
          );
        }

        const receiptProduct = new ReceiptProduct();
        receiptProduct.quantity = product.quantity;
        receiptProduct.price = product.price;
        receiptProduct.productSizeId = product.productSizeId;
        receiptProduct.receiptId = createdReceipt.id;
        foundProductItem.quantity += product.quantity;
        foundProductItem.product.stock += product.quantity;
        createdReceipt.total += product.quantity * product.price;

        productsInStock.push(foundProductItem.product);
        productSizes.push(foundProductItem);
        receiptProducts.push(receiptProduct);
      });

      await manager.save(Receipt, createdReceipt);
      await manager.save(receiptProducts);
      await manager.save(productSizes);
      await manager.save(productsInStock);
    });
  }
}
