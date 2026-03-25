import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { getMultipleFileUploadOptions, getSingleFileUploadOptions } from '../../security/config/multer.config';

@Injectable()
export class DocumentFilesUploadInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const MulterInterceptorClass = FilesInterceptor('files', undefined, getMultipleFileUploadOptions(this.configService));
    const multerInterceptor: NestInterceptor = new MulterInterceptorClass();
    return multerInterceptor.intercept(context, next);
  }
}

@Injectable()
export class DocumentFileUploadInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const MulterInterceptorClass = FileInterceptor('file', undefined, getSingleFileUploadOptions(this.configService));
    const multerInterceptor: NestInterceptor = new MulterInterceptorClass();
    return multerInterceptor.intercept(context, next);
  }
}
