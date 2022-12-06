import { AuthorizeGuard } from '@app/auth/guard/roles.decorator';
import { ValidHttpResponse } from '@core/response/validHttp.response';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USER_ROLE } from 'src/common/enums';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptService } from './receipt.service';

@ApiTags('receipts')
@Controller('receipts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
export class ReceiptController {
  constructor(public receiptService: ReceiptService) {}

  @Get()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get receipts',
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
    description: 'Search',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Prefix default is ascending, Add - for descending',
    example: '-total',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get receipts',
  })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('filter') filter: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    const data = await this.receiptService.findAll(
      { filter, search, sort },
      { page, limit },
    );
    return ValidHttpResponse.toOkResponse(data);
  }

  @Post()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new receipt',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create new receipt',
  })
  async createReceipt(@Body() createReceiptDto: CreateReceiptDto) {
    await this.receiptService.createOne(createReceiptDto);
    return ValidHttpResponse.toCreatedResponse();
  }
}
