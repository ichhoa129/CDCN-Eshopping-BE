import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateProductSizeDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  sizeId: number;
}
