import {environment} from "@env/environment";

export const AuthDriverApis = {
  login: environment.contentEngineURL + "auth/login",
  logout: environment.serverURL + "auth/logout",
  resetPassword: environment.serverURL + "user/resetPassword",
}
