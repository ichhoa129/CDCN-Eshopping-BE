import { AuthorizeGuard } from '@app/auth/guard/roles.decorator';
import { ValidHttpResponse } from '@core/response/validHttp.response';
import {
  Body,
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
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USER_ROLE } from 'src/common/enums';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(public discountService: DiscountService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all discounts',
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
    description: 'Search by name of discount',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Prefix default is ascending, Add - for descending',
    example: '-percent',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all discounts',
  })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('filter') filter: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    const data = await this.discountService.findAll(
      { filter, search, sort },
      { page, limit },
    );
    return ValidHttpResponse.toOkResponse(data);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get discount by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get discount by id',
  })
  async getDiscountById(@Param('id') id: number) {
    const data = await this.discountService.findOneById(id);
    return ValidHttpResponse.toOkResponse(data);
  }

  @Post()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new discount',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create new discount',
  })
  async createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
    await this.discountService.createOne(createDiscountDto);
    return ValidHttpResponse.toCreatedResponse();
  }

  @Put('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update discount',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update discount',
  })
  async updateDiscount(
    @Param('id') id,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    await this.discountService.updateOne(id, updateDiscountDto);
    return ValidHttpResponse.toNoContentResponse();
  }

  @Delete('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete discount',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete discount',
  })
  async deleteDiscount(@Param('id') id: number) {
    await this.discountService.deleteOne(id);
    return ValidHttpResponse.toNoContentResponse();
  }
}
