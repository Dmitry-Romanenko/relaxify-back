import { Controller } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { Article } from '@prisma/client';
import { BaseController } from 'common/base/base.controller';
import { ArticlesService } from './articles.service';
import { CreateBaseDto, UpdateBaseDto } from 'common/base/dto/base.dto';

@Controller('articles')
export class ArticlesController extends BaseController<
  Article,
  CreateBaseDto,
  UpdateBaseDto,
  ArticlesService
> {
  constructor(articlesService: ArticlesService, uploadService: UploadService) {
    super(articlesService, uploadService);
  }
}
