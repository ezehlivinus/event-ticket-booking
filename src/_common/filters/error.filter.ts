import {
  Logger,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  HttpExceptionOptions
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private readonly configService = new ConfigService();

  catch(exception: any, host: ArgumentsHost) {
    // it does not print stack trace
    // this.logger.error(exception); // Nest logger
    console.error(exception); // Node console

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse() as {
        message: string[] | string;
      };
      let errorMessage: string;

      if (exception instanceof ForbiddenException) {
        if (Array.isArray(errorResponse.message)) {
          errorMessage = errorResponse.message?.[0];
        } else {
          errorMessage = errorResponse.message;
        }

        if (errorMessage === 'Forbidden' || !errorMessage) {
          errorMessage = 'Forbidden resource: You are not allowed to take this action or access this resource.';
        }
      } else if (exception instanceof UnauthorizedException) {
        errorMessage =
          exception.message !== 'Unauthorized'
            ? exception.message
            : 'Unauthorized access: Please login to access this resource.';
      } else if (typeof errorResponse.message === 'string') {
        errorMessage = errorResponse.message;
      } else if (exception instanceof HttpException) {
        const httpContext = exception.getResponse() as {
          response: string | Record<string, any>;
          status: number;
          options: HttpExceptionOptions;
        };
        const exceptionResponse = httpContext?.response;
        errorMessage = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse?.response?.message;
        errorMessage = errorMessage || (httpContext as unknown as string);
      } else {
        errorMessage = errorResponse.message?.[0];
      }

      return response.status(status).json({
        success: false,
        error: errorMessage,
        errors: Array.isArray(errorResponse.message) ? errorResponse.message : undefined
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
}
