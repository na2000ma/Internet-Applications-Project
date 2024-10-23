import {Injectable} from "@angular/core";
import {Store} from "@ngxs/store";
import {SetLoginAction} from "@app/pages/auth/store/auth.action";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private store: Store, private router: Router) {
  }

  initApp() {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const userToken = localStorage.getItem('userToken');
    if (!authUser || !userToken) {
      this.router.navigate(['auth', 'sign-in']);
      return this.logout();
    }
    return this.login(authUser, userToken);
  }

  login(authUser: any, userToken: string) {
    this.setData(authUser, userToken);
    return this.store.dispatch(new SetLoginAction(authUser, userToken));
  }

  logout() {
    this.resetData();
    return this.store.dispatch(new SetLoginAction(null, null));
  }

  private setData(authUser: any, userToken: string) {
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem('userToken', userToken);
  }

  private resetData() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('userToken');
  }
}
