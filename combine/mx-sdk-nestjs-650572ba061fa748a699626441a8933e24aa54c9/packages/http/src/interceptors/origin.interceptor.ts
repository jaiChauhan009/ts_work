import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { ContextTracker } from "@terradharitri/sdk-nestjs-common";
import { randomUUID } from 'crypto';

@Injectable()
export class OriginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType: string = context.getType();

    if (!["http", "https"].includes(contextType)) {
      return next.handle();
    }

    const apiFunction = context.getClass().name + '.' + context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] ?? randomUUID();

    ContextTracker.assign({ origin: apiFunction, requestId });

    return next
      .handle()
      .pipe(
        tap(() => {
          ContextTracker.unassign();

          if (!request.res.headersSent) {
            request.res.set('X-Request-Id', requestId);
          }
        }),
        catchError(err => {
          ContextTracker.unassign();

          if (!request.res.headersSent) {
            request.res.set('X-Request-Id', requestId);
          }

          return throwError(() => err);
        })
      );
  }
}
