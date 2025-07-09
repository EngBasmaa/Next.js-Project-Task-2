import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomLogger } from '../logger/custom.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: CustomLogger) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, body, params, query, headers } = request;
        const userAgent = headers['user-agent'] || '';
        const startTime = Date.now();

        // Log the incoming request
        this.logger.log(
            `Incoming ${method} request to ${url}`,
            'HTTP_REQUEST'
        );

        this.logger.debug(
            {
                method,
                url,
                body: method !== 'GET' ? body : undefined,
                params,
                query,
                userAgent,
            },
            'HTTP_REQUEST_DETAILS'
        );

        return next.handle().pipe(
            tap((data) => {
                const duration = Date.now() - startTime;
                const statusCode = response.statusCode;

                // Log successful response
                this.logger.logRequest(method, url, duration, statusCode);

                this.logger.debug(
                    {
                        method,
                        url,
                        statusCode,
                        duration,
                        responseSize: JSON.stringify(data).length,
                    },
                    'HTTP_RESPONSE'
                );
            }),
            catchError((error) => {
                const duration = Date.now() - startTime;
                const statusCode = error.status || 500;

                // Log error response
                this.logger.error(
                    `Request failed: ${method} ${url} - ${statusCode} - ${duration}ms`,
                    error.stack,
                    'HTTP_ERROR'
                );

                this.logger.debug(
                    {
                        method,
                        url,
                        statusCode,
                        duration,
                        error: {
                            message: error.message,
                            name: error.name,
                        },
                    },
                    'HTTP_ERROR_DETAILS'
                );

                throw error;
            }),
        );
    }
}
