import { Module } from '@nestjs/common';
import { cloudinaryProviders } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [],
  providers: [CloudinaryService, ...cloudinaryProviders],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
