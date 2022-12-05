import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { QuantityOfSize } from '../../product_size/dto/quantity-of-size.dto';

export class CreateProductDto {
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
