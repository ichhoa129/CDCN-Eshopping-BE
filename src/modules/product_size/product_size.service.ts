import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import { ProductSize } from './product_size.entity';

@Injectable()
export class ProductSizeService {
  constructor(
    @Inject('PRODUCT_SIZE_REPOSITORY')
    private productSizeRepository: Repository<ProductSize>,
  ) {}

  async findOneById(id: number): Promise<ProductSize> {
    const size = await this.productSizeRepository.findOneBy({ id });

    if (!size) {
      throw new NotFoundException('Size of product not found');
    }

    return size;
  }

  async createOne(createProductSizeDto: CreateProductSizeDto): Promise<void> {
    const { quantity, productId, sizeId } = createProductSizeDto;

    const productSize = new ProductSize();
    productSize.quantity = quantity;
    productSize.productId = productId;
    productSize.sizeId = sizeId;

    await this.productSizeRepository.insert(productSize);
  }

  async updateOne(
    id: number,
    updateProductSizeDto: UpdateProductSizeDto,
  ): Promise<void> {
    const { quantity } = updateProductSizeDto;

    const productSize = await this.findOneById(id);
    productSize.quantity = quantity;

    await this.productSizeRepository.update(productSize.id, productSize);
  }
}
