export class GetAllClassificationsAction {
  static readonly type = '[searchTemplate] Get All Classifications'
}

export class SetAllClassificationsAction {
  static readonly type = '[searchTemplate] Set All Classifications'

  constructor(public classifications: any[]) {
  }
}

export class SetSearchPageTitleAction {
  static readonly type = '[searchTemplate] Set Search Page Title Action'

  constructor(public searchPageTitle: string) {
  }
}

export class GetFilteredDocumentsAction {
  static readonly type = '[searchTemplate] Get Filtered Documents Action'

  constructor(public payload: any) {
  }
}






