import { CloudinaryService } from '@app/cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadFile(file: any): Promise<any> {
    return this.cloudinaryService.uploadImage(file);
  }

  async uploadManyFiles(files: Array<Express.Multer.File>): Promise<any> {
    const tasks = files.map((file) => {
      return this.cloudinaryService.uploadImage(file);
    });
    return Promise.all(tasks);
  }
}
