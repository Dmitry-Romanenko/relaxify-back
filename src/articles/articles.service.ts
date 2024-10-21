import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { Article, Prisma } from '@prisma/client';
import { BaseService } from 'common/base/base.service';

@Injectable()
export class ArticlesService extends BaseService<Article> {
  constructor(prisma: PrismaService, uploadService: UploadService) {
    super(prisma, uploadService, {
      create: (data) => prisma.article.create(data),
      update: (data) => prisma.article.update(data),
      delete: (data) => prisma.article.delete(data),
      findMany: (args: Prisma.ArticleFindManyArgs) =>
        prisma.article.findMany(args),
      findUnique: (data) => prisma.article.findUnique(data),
      findUniqueById: (data) => prisma.article.findUnique(data),
    });
  }
}
