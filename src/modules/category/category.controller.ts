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
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { USER_ROLE } from 'src/common/enums';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(public categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['Categories'],
    summary: 'Get categories',
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
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name of category',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Prefix default is ascending, Add - for descending',
    example: '-name',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get categories',
  })
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    const data = await this.categoryService.findAll(
      { search, sort },
      { page, limit },
    );
    return ValidHttpResponse.toOkResponse(data);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['Categories'],
    summary: 'Get category by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get category',
  })
  async getCategoryById(@Param('id') id) {
    const data = await this.categoryService.findOneById(id);
    return ValidHttpResponse.toOkResponse(data);
  }

  @Post()
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['Categories'],
    summary: 'Create new category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create new category',
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoryService.createOne(createCategoryDto);
    return ValidHttpResponse.toCreatedResponse();
  }

  @Put('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    tags: ['Categories'],
    summary: 'Update category',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update category',
  })
  async updateCategory(
    @Param('id') id,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoryService.updateOne(id, updateCategoryDto);
    return ValidHttpResponse.toNoContentResponse();
  }

  @Delete('/:id')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    tags: ['Categories'],
    summary: 'Delete category',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete category',
  })
  async deleteCategory(@Param('id') id) {
    await this.categoryService.deleteOne(id);
    return ValidHttpResponse.toNoContentResponse();
  }
}
