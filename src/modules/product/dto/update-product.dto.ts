import { QuantityOfSize } from '@app/product_size/dto/quantity-of-size.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PRODUCT_STATUS } from 'src/common/enums/product.enum';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty()
  @IsEnum(PRODUCT_STATUS)
  status: PRODUCT_STATUS;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    type: [QuantityOfSize],
  })
  @IsArray()
  @ArrayNotEmpty()
  sizes: QuantityOfSize[];
}
