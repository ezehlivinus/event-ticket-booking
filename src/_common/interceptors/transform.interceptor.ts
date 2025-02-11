import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T extends { data?: any | undefined } & { message?: any | undefined }>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        const success = data?.success ?? true;
        delete data?.success; // remove success property from data if exists
        const message = this.getMessage(data);
        const transformedData = this.getTransformedData(data);
        return { success, message, ...transformedData };
      })
    );
  }

  private getMessage(data: T): string | undefined {
    if (data?.message && typeof data?.message === 'string') {
      const message = data.message;
      delete data.message;
      return message;
    }

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data?.data === 'string') {
      const message = data.data;
      delete data.data;
      return message;
    }

    return undefined;
  }

  private getTransformedData(data: T): T | undefined {
    if (typeof data?.data === 'string') {
      delete data.data;
    }

    if (typeof data === 'string') {
      return undefined;
    }

    return data;
  }
}
