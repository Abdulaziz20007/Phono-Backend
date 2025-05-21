import {
  Logger,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      error:
        exception instanceof HttpException ? exception.name : 'Unknown Error',
    };

    // Log the error with more context
    this.logger.error(`${request.method} ${request.url}`, {
      status,
      error: errorResponse.error,
      message: errorResponse.message,
      timestamp: errorResponse.timestamp,
    });

    response.status(status).json(errorResponse);
  }
}
