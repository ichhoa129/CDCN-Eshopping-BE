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
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { SizeService } from './size.service';

@ApiTags('sizes')
@Controller('sizes')
export class SizeController {
  constructor(public sizeService: SizeService) {}

  @Get()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get sizes',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name of size',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Prefix default is ascending, Add - for descending',
    example: '-updatedAt',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get sizes',
  })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('filter') filter: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    const data = await this.sizeService.findAll(
      { filter, search, sort },
      { page, limit },
    );
    return ValidHttpResponse.toOkResponse(data);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get size by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get size',
  })
  async getSizeById(@Param('id') id) {
    const data = await this.sizeService.findOneById(id);
    return ValidHttpResponse.toOkResponse(data);
  }

  @Post()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new size',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create new size',
  })
  async createSize(@Body() createSizeDto: CreateSizeDto) {
    await this.sizeService.createOne(createSizeDto);
    return ValidHttpResponse.toCreatedResponse();
  }

  @Put('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update size',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update size',
  })
  async updateSize(@Param('id') id, @Body() updateSizeDto: UpdateSizeDto) {
    await this.sizeService.updateOne(id, updateSizeDto);
    return ValidHttpResponse.toNoContentResponse();
  }

  @Delete('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete size',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete size',
  })
  async deleteSize(@Param('id') id) {
    await this.sizeService.deleteOne(id);
    return ValidHttpResponse.toNoContentResponse();
  }
}
