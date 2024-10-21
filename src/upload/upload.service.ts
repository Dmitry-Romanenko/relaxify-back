import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PassThrough } from 'stream';
import * as mm from 'music-metadata';

@Injectable()
export class UploadService {
  constructor() {}

  async uploadAudio(
    file: Express.Multer.File,
  ): Promise<{ url: string; duration: number; audioPublicId: string }> {
    const duration = await this.getAudioDuration(file.buffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'meditations/audio' },
        (error, result) => {
          if (error) {
            return reject(new BadRequestException('File download error'));
          }
          resolve({
            url: result.secure_url,
            duration,
            audioPublicId: result.public_id,
          });
        },
      );

      const stream = new PassThrough();
      stream.end(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; imgPublicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'meditations/images' },
        (error, result) => {
          if (error) {
            return reject(new BadRequestException('Error loading image'));
          }
          resolve({ url: result.secure_url, imgPublicId: result.public_id });
        },
      );

      const stream = new PassThrough();
      stream.end(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  async updateAudio(
    oldPublicId: string,
    newFile: Express.Multer.File,
  ): Promise<{ url: string; duration: number; audioPublicId: string }> {
    await this.deleteFile(oldPublicId);
    return this.uploadAudio(newFile);
  }

  async updateImage(
    oldPublicId: string,
    newFile: Express.Multer.File,
  ): Promise<{ url: string; imgPublicId: string }> {
    await this.deleteFile(oldPublicId);
    return this.uploadImage(newFile);
  }

  async deleteFile(publicId: string): Promise<void> {
    return cloudinary.uploader.destroy(publicId);
  }

  private async getAudioDuration(buffer: Buffer): Promise<number> {
    try {
      const metadata = await mm.parseBuffer(buffer);
      return metadata.format.duration || 0;
    } catch (err) {
      console.error('Error reading audio metadata:', err);
      throw new BadRequestException('Error checking file duration');
    }
  }
}
