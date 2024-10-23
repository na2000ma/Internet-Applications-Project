import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {finalize, Observable, take} from 'rxjs';
import {OrganizoLoadingService} from "@organizo/services/loading/loading.service";

export const organizoLoadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const organizoLoadingService = inject(OrganizoLoadingService);
  let handleRequestsAutomatically = false;

  organizoLoadingService.auto$
    .pipe(take(1))
    .subscribe((value) => {
      handleRequestsAutomatically = value;
    });

  // If the Auto mode is turned off, do nothing
  if (!handleRequestsAutomatically) {
    return next(req);
  }

  // Set the loading status to true
  organizoLoadingService._setLoadingStatus(true, req.url);

  return next(req).pipe(
    finalize(() => {
      // Set the status to false if there are any errors or the request is completed
      organizoLoadingService._setLoadingStatus(false, req.url);
    }));
};
