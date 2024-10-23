import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthDriverApis} from "@app/pages/auth/driver/auth-driver.apis";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  login(payload: any) {
    return this.httpClient.post(AuthDriverApis.login, payload)
  }

  logout() {
    return this.httpClient.get(AuthDriverApis.logout)
  }

  resetPassword(payload: any) {
    return this.httpClient.post(AuthDriverApis.resetPassword, payload)
  }
}
