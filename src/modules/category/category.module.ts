import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryProviders } from './category.provider';
import { DatabaseModule } from '@app/base/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CategoryService, ...categoryProviders],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
