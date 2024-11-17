import {environment} from "@env/environment";

export const AuthDriverApis = {
  login: environment.serverURL + "api/login",
  logout: environment.serverURL + "auth/logout",
}
