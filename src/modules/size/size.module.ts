import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { sizeProviders } from './size.provider';

@Module({
  imports: [DatabaseModule],
  providers: [SizeService, ...sizeProviders],
  controllers: [SizeController],
  exports: [SizeService],
})
export class SizeModule {}
