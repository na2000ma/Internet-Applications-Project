import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable, NgZone} from "@angular/core";
import {get} from "lodash-es";
import {
  GetLoginAction,
  GetLogoutAction,
  GetResetPasswordAction,
  SetLoginAction,
} from "@app/pages/auth/store/auth.action";
import {AuthService} from "@app/pages/auth/services/auth.service";
import {asapScheduler, tap} from "rxjs";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {ShowFailedToast, StartLoaderAction} from "@app/store/app.action";
import {AppService} from "@app/services/app.service";
import {Router} from "@angular/router";
import {AuthUser} from "@app/models/auth-user.model";

class AuthModel {
  authUser: AuthUser;
  userToken: string;
}

const defaults = {
  authUser: null,
  userToken: null,
}

@State({
  name: 'auth',
  defaults
})

@Injectable()
export class AuthState {

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private router: Router,
    private ngZone: NgZone
  ) {
  }

  @Selector()
  static authUser(state: AuthState) {
    return get(state, 'authUser') || null;
  }

  @Selector()
  static userToken(state: AuthState) {
    return get(state, 'userToken') || null;
  }

  @Selector()
  static tokenVersion(state: AuthState) {
    return get(state, 'tokenVersion') || null;
  }

  @Selector()
  static organization(state: AuthState) {
    return get(state, 'organization') || null;
  }

  @Selector()
  static userPermissions(state: AuthState) {
    return get(state, 'userPermissions') || null;
  }

  @Action(GetLoginAction)
  getLoginAction({dispatch}: StateContext<AuthModel>, {payload}: GetLoginAction) {
    return this.authService.login(payload).pipe(
      tap((response: AppHttpResponse) => {
          response.handle(
            (data, extra, headers) => {
              const authUser = get(data, 'user.user');
              const userToken = headers.get('Authorization');
              this.appService.login(authUser, userToken);
              if (!get(data, 'user.forceChange')) {
                this.ngZone.run(() => {
                  this.router.navigate(['folder-structure', 'home-page'])
                })
              } else {
                this.ngZone.run(() => {
                  this.router.navigate(['auth', 'reset-password']);
                })
              }
              dispatch(new StartLoaderAction(true));
            },
            (message) => {
              asapScheduler.schedule(() => dispatch(new ShowFailedToast(message)))
              dispatch(new StartLoaderAction(true));
            },
            (errors) => {
              asapScheduler.schedule(() => dispatch(new ShowFailedToast(errors)))
              dispatch(new StartLoaderAction(true));
            }
          )
        dispatch(new StartLoaderAction(false));
        }
      )
    )
  }

  @Action(GetLogoutAction)
  getLogoutAction({dispatch}: StateContext<AuthModel>,
                  {navigate}: GetLogoutAction) {
    return this.authService.logout().pipe(
      tap((response: AppHttpResponse) => {
          response.handle(
            () => {
              this.ngZone.run(() => {
                this.router.navigate(navigate).then(value => {
                  if (value) {
                    this.appService.logout();
                  }
                })
              })
            },
            (message) => {
              asapScheduler.schedule(() => dispatch(new ShowFailedToast(message)))
            },
            (errors) => {
              asapScheduler.schedule(() => dispatch(new ShowFailedToast(errors)))
            }
          )
        }
      )
    )
  }

  @Action(SetLoginAction)
  setLoginAction({patchState}: StateContext<AuthModel>,
                 {authUser, userToken}: SetLoginAction) {
    patchState({authUser, userToken});
  }

  @Action(GetResetPasswordAction)
  getResetPasswordAction({dispatch}: StateContext<AuthModel>, {payload}: GetResetPasswordAction) {
    return this.authService.resetPassword(payload).pipe(
      tap((response: AppHttpResponse) => {
          response.handle(
            (data, extra, headers) => {
              const authUser = get(data, '1.user');
              const userToken = headers.get('Authorization');
              this.appService.login(authUser, userToken);
              this.ngZone.run(() => {
                this.router.navigate(['active-directory', 'home-page'])
              })
            },
            (message) => {
              asapScheduler.schedule(() => dispatch(new ShowFailedToast(message)))
            },
            (errors) => {
              asapScheduler.schedule(() => dispatch(new ShowFailedToast(errors)))
            }
          )
        }
      )
    )
  }

}
