export class GetLoginAction {
  static readonly type = '[auth] Get Login'

  constructor(public payload: any) {
  }
}

export class GetLogoutAction {
  static readonly type = '[auth] Get Logout'

  constructor(public navigate: string[]) {
  }
}

export class SetLoginAction {
  static readonly type = '[auth] Set Login'

  constructor(
    public authUser: any,
    public userToken: string,
  ) {
  }
}

export class GetResetPasswordAction {
  static readonly type = '[auth] Get Reset Password'

  constructor(public payload: any) {
  }
}
