import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { Meditation, Prisma } from '@prisma/client';
import { BaseService } from 'common/base/base.service';

@Injectable()
export class MeditationsService extends BaseService<Meditation> {
  constructor(prisma: PrismaService, uploadService: UploadService) {
    super(prisma, uploadService, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      create: (data) => prisma.meditation.create(data),
      update: (data) => prisma.meditation.update(data),
      delete: (data) => prisma.meditation.delete(data),
      findMany: (args: Prisma.MeditationFindManyArgs) =>
        prisma.meditation.findMany(args),
      findUnique: (data) => prisma.meditation.findUnique(data),
      findUniqueById: (data) => prisma.meditation.findUnique(data),
    });
  }
}
