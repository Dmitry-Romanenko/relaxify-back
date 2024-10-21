import { Controller } from '@nestjs/common';
import { MeditationsService } from './meditations.service';
import { UploadService } from '../upload/upload.service';
import { Meditation } from '@prisma/client';
import { BaseController } from 'common/base/base.controller';
import { CreateBaseDto, UpdateBaseDto } from 'common/base/dto/base.dto';

@Controller('meditations')
export class MeditationsController extends BaseController<
  Meditation,
  CreateBaseDto,
  UpdateBaseDto,
  MeditationsService
> {
  constructor(
    meditationsService: MeditationsService,
    uploadService: UploadService,
  ) {
    super(meditationsService, uploadService);
  }
}
