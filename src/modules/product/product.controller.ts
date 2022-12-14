import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { ValidHttpResponse } from '@core/response/validHttp.response';
import { USER_ROLE } from 'src/common/enums';
import { AuthorizeGuard } from '@app/auth/guard/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(
    public productService: ProductService, // @Inject(CACHE_MANAGER) // private cacheManager: Cache,
  ) {}

  @Get()
  @CacheTTL(60 * 10)
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['Products'],
    summary: 'Get products',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Default: 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Default: 10',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'category|($eq|$gt|$lt|$like)|value',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name of product',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Prefix default is ascending, Add - for descending',
    example: '-price',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get products',
  })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('filter') filter: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    const data = await this.productService.findAll(
      { filter, search, sort },
      { page, limit },
    );
    return ValidHttpResponse.toOkResponse(data);
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['Products'],
    summary: 'Get product by slug',
  })
  @ApiParam({
    name: 'slug',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get product',
  })
  async getProductById(@Param('slug') slug: string) {
    const data = await this.productService.findOneBySlug(slug);
    return ValidHttpResponse.toOkResponse(data);
  }

  @Post()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['Products'],
    summary: 'Create new product',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create new product',
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    await this.productService.createOne(createProductDto);
    return ValidHttpResponse.toCreatedResponse();
  }

  @Put('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    tags: ['Products'],
    summary: 'Update product',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update product',
  })
  async updateProduct(
    @Param('id') id,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.updateOne(id, updateProductDto);
    return ValidHttpResponse.toNoContentResponse();
  }

  @Delete('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    tags: ['Products'],
    summary: 'Delete product',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete product',
  })
  async deleteProduct(@Param('id') id) {
    await this.productService.deleteOne(id);
    return ValidHttpResponse.toNoContentResponse();
  }
}
