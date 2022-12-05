import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
