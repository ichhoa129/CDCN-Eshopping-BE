import { DatabaseModule } from '@app/base/database/database.module';
import { CloudinaryModule } from '@app/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { imageProviders } from './image.provider';
import { ImageService } from './image.service';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [ImageController],
  providers: [ImageService, ...imageProviders],
  exports: [ImageService],
})
export class ImageModule {}
