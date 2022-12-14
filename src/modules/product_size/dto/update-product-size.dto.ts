import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateProductSizeDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
