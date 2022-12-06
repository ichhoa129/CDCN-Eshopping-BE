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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidHttpResponse } from '@core/response/validHttp.response';
import { AuthorizeGuard } from '@app/auth/guard/roles.decorator';
import { USER_ROLE } from 'src/common/enums';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
export class OrderController {
  constructor(public orderService: OrderService) {}

  @Get()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @ApiOperation({
    summary: 'Get all orders',
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
    description: 'status|($eq|$gt|$lt|$like)|on_payment',
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
    example: '-total',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all orders' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('filter') filter: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    const data = await this.orderService.findAll(
      { filter, search, sort },
      { page, limit },
    );
    return ValidHttpResponse.toOkResponse(data);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get one order by id',
  })
  @AuthorizeGuard([USER_ROLE.USER])
  @HttpCode(HttpStatus.OK)
  async getOne(
    @Request() req: any,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    const data = await this.orderService.findOneByUser(orderId, req.user.id);
    return ValidHttpResponse.toOkResponse(data);
  }

  @Post()
  @AuthorizeGuard([USER_ROLE.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
  })
  async create(@Body() createOrdertDto: CreateOrderDto, @Request() req) {
    const payUrl = await this.orderService.createOrder(
      createOrdertDto,
      req.user.email,
    );
    return ValidHttpResponse.toCreatedResponse({ payUrl });
  }

  @Put('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update order status',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update order status',
  })
  async updateDiscount(
    @Param('id') id,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    await this.orderService.updateStatus(id, updateOrderDto.status);
    return ValidHttpResponse.toNoContentResponse();
  }

  @Delete('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete order',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete order',
  })
  async deleteOrder(@Param('id') id) {
    await this.orderService.deleteOne(id);
    return ValidHttpResponse.toNoContentResponse();
  }
}
