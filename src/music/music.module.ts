import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [MusicController],
  providers: [MusicService, PrismaService, UploadService],
})
export class MusicModule {}
