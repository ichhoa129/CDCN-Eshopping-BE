import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

class ProductItems {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  productSizeId: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [ProductItems] })
  @IsArray()
  @ArrayNotEmpty()
  items: ProductItems[];

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}
