import { Module } from '@nestjs/common';
import { MeditationsModule } from './meditations/meditations.module';
import { MusicModule } from './music/music.module';
import { PrismaService } from './prisma/prisma.service';
import { UploadModule } from './upload/upload.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [MeditationsModule, MusicModule, UploadModule, ArticlesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
