import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as marked from 'marked';

@Injectable()
export class ReadingTimeInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const routePath = request.route.path;

    if (
      routePath.includes('articles') &&
      request.body &&
      typeof request.body.description === 'string'
    ) {
      const readingTime = await this.calculateReadingTime(
        request.body.description,
      );
      request.body.duration = readingTime;
    }

    return next.handle();
  }

  private async calculateReadingTime(markdownText: string) {
    const text = await marked.parse(markdownText);

    const plainText = text.replace(/<\/?[^>]+(>|$)/g, '');
    console.log(plainText);
    const wordCount = plainText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
