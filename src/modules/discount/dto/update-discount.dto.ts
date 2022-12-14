import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateDiscountDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsPositive()
  percent: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  fromDay?: string;

  @ApiProperty()
  @Matches(/^(2[0-3]|[0-1][0-9]):([0-5][0-9]):([0-5][0-9])$/)
  @IsOptional()
  fromTime?: string;

  @ApiProperty()
  @IsDateString()
  toDay: string;

  @ApiProperty()
  @Matches(/^(2[0-3]|[0-1][0-9]):([0-5][0-9]):([0-5][0-9])$/)
  toTime: string;

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  productIds: number[];

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  categoryIds: number[];
}
