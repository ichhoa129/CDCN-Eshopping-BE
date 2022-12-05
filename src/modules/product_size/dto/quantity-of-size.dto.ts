import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class QuantityOfSize {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  sizeId: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
