import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageOption } from '@config/image.config';
import { AuthorizeGuard } from '@app/auth/guard/roles.decorator';
import { USER_ROLE } from 'src/common/enums';

@Controller('images')
export class ImageController {
  constructor(public imageService: ImageService) {}

  @Post('upload')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5242880 },
      fileFilter: imageOption.fileFilter,
      dest: './uploads',
    }),
  )
  @ApiOperation({
    tags: ['Images'],
    summary: 'Upload image',
  })
  async uploadFile(
    @UploadedFile()
    file,
  ) {
    return this.imageService.uploadFile(file);
  }

  @Post('upload-many')
  @AuthorizeGuard([USER_ROLE.ADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 20, imageOption))
  @ApiOperation({
    tags: ['Images'],
    summary: 'Upload image',
  })
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.imageService.uploadManyFiles(files);
  }
}
