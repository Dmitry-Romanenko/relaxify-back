import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Article, Meditation, Music, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

export abstract class BaseService<T extends Meditation | Music | Article> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly uploadService: UploadService,
    private readonly modelDelegate: {
      create(data: {
        data:
          | Prisma.MeditationCreateInput
          | Prisma.MusicCreateInput
          | Prisma.ArticleCreateInput;
      }): Promise<T>;
      update(data: {
        where: { id: string };
        data:
          | Prisma.MeditationUpdateInput
          | Prisma.MusicUpdateInput
          | Prisma.ArticleUpdateInput;
      }): Promise<T>;
      delete(data: { where: { id: string } }): Promise<T>;
      findMany(
        args:
          | Prisma.MeditationFindManyArgs
          | Prisma.MusicFindManyArgs
          | Prisma.ArticleFindManyArgs,
      ): Promise<T[]>;
      findUnique(data: { where: { slug: string } }): Promise<T | null>;
      findUniqueById(data: { where: { id: string } }): Promise<T | null>;
    },
  ) {}

  async getAll(limit?: number, page?: number): Promise<T[]> {
    const skip = (page - 1) * limit;
    return this.modelDelegate.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBySlug(slug: string): Promise<T> {
    const item = await this.modelDelegate.findUnique({ where: { slug } });

    if (!item) {
      throw new NotFoundException(`Item with slug ${slug} not found`);
    }

    return item;
  }

  async create(
    data: Prisma.MeditationCreateInput | Prisma.MusicCreateInput,
  ): Promise<T> {
    return this.modelDelegate.create({ data });
  }

  async update(
    id: string,
    data: Prisma.MeditationUpdateInput | Prisma.MusicUpdateInput,
  ): Promise<T> {
    return this.modelDelegate.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    const item = await this.modelDelegate.findUniqueById({ where: { id } });

    if (!item) {
      throw new BadRequestException('Item not found');
    }

    try {
      if ('sound' in item && item.sound?.publicId) {
        await this.uploadService.deleteFile((item as any).sound.publicId);
      }

      if (item.img?.publicId) {
        await this.uploadService.deleteFile((item as any).img.publicId);
      }

      return await this.modelDelegate.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Error deleting files');
    }
  }
}
