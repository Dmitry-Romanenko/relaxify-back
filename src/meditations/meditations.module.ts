import { Module } from '@nestjs/common';
import { MeditationsController } from './meditations.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { MeditationsService } from './meditations.service';

@Module({
  controllers: [MeditationsController],
  providers: [MeditationsService, PrismaService, UploadService],
})
export class MeditationsModule {}
