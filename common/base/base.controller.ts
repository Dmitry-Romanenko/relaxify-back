import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Delete,
  Param,
  Patch,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import slugify from 'slugify';
import { BaseService } from 'common/base/base.service';
import { UploadService } from 'src/upload/upload.service';
import { Article, Meditation, Music } from '@prisma/client';
import { ReadingTimeInterceptor } from './interceptor/base.interceptor';
import { ClerkAuthGuard } from './guard/clerk.auth.guard';
import { CreateBaseDto, UpdateBaseDto } from './dto/base.dto';

@UseGuards(ClerkAuthGuard)
@Controller()
export class BaseController<
  T extends Meditation | Music | Article,
  CreateDto extends CreateBaseDto,
  UpdateDto extends UpdateBaseDto,
  Service extends BaseService<T>,
> {
  constructor(
    private readonly service: Service,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async getAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ): Promise<T[]> {
    const limitNumber = !isNaN(+limit) ? +limit : 100;
    const pageNumber = !isNaN(+page) ? +page : 1;
    return this.service.getAll(limitNumber, pageNumber);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<T> {
    return this.service.getBySlug(slug);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: memoryStorage(),
      limits: {
        fileSize: 19 * 1024 * 1024,
      },
    }),
    ReadingTimeInterceptor,
  )
  async create(
    @Body() createDto: CreateDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const soundFile = files?.find((file) => file.mimetype.startsWith('audio/'));
    const imageFile = files?.find((file) => file.mimetype.startsWith('image/'));

    if (!soundFile && !createDto.duration) {
      throw new BadRequestException('Audio file is required');
    }

    if (!imageFile) {
      throw new BadRequestException('Image is required');
    }

    createDto.slug = slugify(createDto.title);

    const item = await this.service.create(createDto);

    try {
      const sound =
        soundFile && (await this.uploadService.uploadAudio(soundFile));

      const { url: imageUrl, imgPublicId } =
        await this.uploadService.uploadImage(imageFile);

      const slug = slugify(item.title);

      const objToUpdate = {
        slug,
        img: {
          url: imageUrl,
          publicId: imgPublicId,
        },
      };

      if (sound) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        objToUpdate.sound = {
          duration: sound.duration,
          publicId: sound.audioPublicId,
          url: sound.url,
        };
      }

      const itemWithMedia = await this.service.update(item.id, objToUpdate);
      return itemWithMedia;
    } catch (error) {
      await this.service.delete(item.id);
      throw new BadRequestException('Error uploading files');
    }
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: memoryStorage(),
      limits: {
        fileSize: 7 * 1024 * 1024,
      },
    }),
    ReadingTimeInterceptor,
  )
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const soundFile = files?.find((file) => file.mimetype.startsWith('audio/'));
    const imageFile = files?.find((file) => file.mimetype.startsWith('image/'));

    if (updateDto.duration && soundFile) {
      throw new BadRequestException('Article without sound file');
    }

    const item = await this.service.update(id, updateDto);
    try {
      const image =
        imageFile &&
        (await this.uploadService.updateImage(item.img.publicId, imageFile));

      const slug = slugify(item.title);

      if (image || slug) {
        const objToUpdate = {
          slug,
          img: image
            ? {
                url: image.url,
                publicId: image.imgPublicId,
              }
            : item.img,
        };

        if ('sound' in item) {
          const sound =
            soundFile &&
            (await this.uploadService.updateAudio(
              item.sound.publicId,
              soundFile,
            ));
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          objToUpdate.sound = sound
            ? {
                duration: sound.duration,
                publicId: sound.audioPublicId,
                url: sound.url,
              }
            : item.sound;
        }
        const itemWithMedia = await this.service.update(item.id, objToUpdate);
        return itemWithMedia;
      }

      return item;
    } catch (error) {
      throw new BadRequestException('Error during update');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
