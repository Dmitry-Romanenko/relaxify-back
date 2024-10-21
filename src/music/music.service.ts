import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { Music, Prisma } from '@prisma/client';
import { BaseService } from 'common/base/base.service';

@Injectable()
export class MusicService extends BaseService<Music> {
  constructor(prisma: PrismaService, uploadService: UploadService) {
    super(prisma, uploadService, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      create: (data) => prisma.music.create(data),
      update: (data) => prisma.music.update(data),
      delete: (data) => prisma.music.delete(data),
      findMany: (args: Prisma.MusicFindManyArgs) => prisma.music.findMany(args),
      findUnique: (data) => prisma.music.findUnique(data),
      findUniqueById: (data) => prisma.music.findUnique(data),
    });
  }
}
