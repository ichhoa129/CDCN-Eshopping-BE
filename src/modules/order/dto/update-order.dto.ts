import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ORDER_STATUS } from 'src/common/enums/order.enum';

export class UpdateOrderDto {
  @ApiProperty()
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;
}
