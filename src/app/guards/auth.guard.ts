import {ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {AuthState} from "@app/pages/auth/store/auth.state";

export const authGuard: CanActivateFn | CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authUser = inject(Store).selectSnapshot(AuthState.authUser);
  return authUser ?? false;
};
