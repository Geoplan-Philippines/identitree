import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

/**
 * Catches HttpExceptions and returns a consistent error envelope.
 *
 * Applied per-controller via @UseFilters(HttpExceptionFilter).
 * Returns: { statusCode, message, error }.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, unknown>).message ?? 'An error occurred';

    response.status(statusCode).json({
      statusCode,
      message,
      error: exception.name,
    });
  }
}
