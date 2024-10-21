import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, UploadService],
})
export class ArticlesModule {}
