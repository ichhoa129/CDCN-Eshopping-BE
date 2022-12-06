/* eslint-disable @typescript-eslint/naming-convention */
import { v2 } from 'cloudinary';
export enum CloudinaryProvider {
  REPOSITORY = 'CLOUDINARY',
}

export const cloudinaryProviders = [
  {
    provide: CloudinaryProvider.REPOSITORY,
    useFactory: () => {
      return v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    },
  },
];
