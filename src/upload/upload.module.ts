import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryConfig } from 'cloudinary.config';

@Module({
  imports: [ConfigModule],
  providers: [UploadService, CloudinaryConfig],
  controllers: [UploadController],
})
export class UploadModule {}
