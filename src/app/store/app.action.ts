export class ShowSuccessToast {
  static readonly type = '[App] Show Success Toast';

  constructor(public message: string = 'alertMsg.processCompletedSuccessfully') {
  }
}

export class ShowFailedToast {
  static readonly type = '[App] Show Failed Toast';

  constructor(public message: string = 'alertMsg.processCompletedFailed') {
  }
}


export class SetLoadingAction {
  static readonly type = '[App] Show Loading';

  constructor(public value: boolean) {
  }
}

export class StartLoaderAction {
  static readonly type = '[App] Start Loader';

  constructor(public value: boolean) {
  }
}
