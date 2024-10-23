import {Injectable, NgZone} from "@angular/core";
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {get} from "lodash-es";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {Store} from "@ngxs/store";
import {AuthState} from "@app/pages/auth/store/auth.state";
import {inject} from "@organizo/injector/app-injector";
import {Router} from "@angular/router";
import {AppService} from "@app/services/app.service";

/**
 * interceptor for auth
 */
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  #bearerToken: string;

  constructor(private store: Store) {
    this.store.select(AuthState.userToken).subscribe(token => this.#bearerToken = token);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<AppHttpResponse>> {
    if (req.body && !req.url.includes("login")) req = this.setRequestBody(req);
    if (req.url.includes('assets')) {
      return next.handle(req);
    }
    if ((!!this.#bearerToken) && !req.url.includes('login')) {
      req = this.setAuthToken(req, this.#bearerToken);
    }
    return this.wrapRequestResult(next.handle(req));
  }

  private wrapRequestResult(requestResult: Observable<HttpEvent<any>>): Observable<HttpEvent<AppHttpResponse>> {
    return requestResult.pipe(
      // @ts-ignore
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress ||
          event.type === HttpEventType.DownloadProgress ||
          event.type === HttpEventType.Response) {
          return this.createAppHttpResponse(event);
        }
      }),
      catchError((err: HttpEvent<any>) => {
        if (get(err, 'status', undefined) === 401) {
          inject(NgZone).run(() => {
            inject(AppService).logout();
            inject(Router).navigate(['auth', 'sign-in']);
          });
          // inject(Store).dispatch(new OpenSnackBar('snackBar.sessionEnds'));
        }
        return of(this.createAppHttpResponse(err));
      })
    );
  }

  private createAppHttpResponse(event: HttpEvent<any>): HttpEvent<AppHttpResponse> {
    return new HttpResponse({body: new AppHttpResponse(event)});
  }

  private setAuthToken(req: HttpRequest<any>, bearerToken: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: bearerToken
      }
    });
  }

  private setRequestBody(req: HttpRequest<any>) {
    return req.clone({
      body: inject(ObjectUtilsService).objectToFormData(req.body)
    });
  }
}
