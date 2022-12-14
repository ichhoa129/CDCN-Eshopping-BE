import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

class Product {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  productSizeId: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}

export class CreateReceiptDto {
  @ApiProperty({ type: [Product] })
  @IsArray()
  @ArrayNotEmpty()
  products: Product[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}
