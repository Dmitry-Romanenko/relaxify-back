import { Controller } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { Music } from '@prisma/client';
import { BaseController } from 'common/base/base.controller';
import { MusicService } from './music.service';
import { CreateBaseDto, UpdateBaseDto } from 'common/base/dto/base.dto';

@Controller('music')
export class MusicController extends BaseController<
  Music,
  CreateBaseDto,
  UpdateBaseDto,
  MusicService
> {
  constructor(musicService: MusicService, uploadService: UploadService) {
    super(musicService, uploadService);
  }
}
