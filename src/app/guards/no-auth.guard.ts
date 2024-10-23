import {CanActivateChildFn, CanActivateFn} from '@angular/router';
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {AuthState} from "@app/pages/auth/store/auth.state";

export const noAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const authUser = inject(Store).selectSnapshot(AuthState.authUser);
  return !authUser;
};
