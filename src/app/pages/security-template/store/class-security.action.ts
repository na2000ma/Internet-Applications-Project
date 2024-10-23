export class GetClassSecurityTemplateByIdAction {
  static readonly type = '[securityClass] Get Class Security Template By Id Action'

  constructor(public classSecurityId: any, public forDefault: boolean = false) {
  }
}

export class GetUsersSecurityTemplateAction {
  static readonly type = '[securityClass] Get Users Security Template Action'

  constructor() {
  }
}

export class GetGroupsSecurityTemplateAction {
  static readonly type = '[securityClass] Get Groups Security Template Action'

  constructor() {
  }
}

export class GetAllFeaturesAction {
  static readonly type = '[securityClass] Get All Features Action'

  constructor(public payload: any) {
  }
}

export class AddSecurityTemplateAction {
  static readonly type = '[securityClass] Add Security Template Action'

  constructor(public payload: any) {
  }
}

export class SetUsersGroupsFeaturesAction {
  static readonly type = '[securityClass] Set Users Groups Features Action'

  constructor(public payload: any) {
  }
}

export class GetFeaturesTypesAction {
  static readonly type = '[securityClass] Get Features Types'

  constructor() {
  }
}

export class SetFeaturesTypesAction {
  static readonly type = '[securityClass] Set Features Types'

  constructor(public payload: any) {
  }
}

export class GetDefaultInstanceSecurityTemplateById {
  static readonly type = '[securityClass] Get Default Security Template By Id'

  constructor(public classSecurityId: any) {
  }
}

export class SetDefaultInstanceSecurityTemplate {
  static readonly type = '[securityClass] Set Default Security Template'

  constructor(public payload: any) {
  }
}

export class AddDefaultInstanceSecurityTemplate {
  static readonly type = '[securityClass] Add Default Security Template'

  constructor(public payload: any) {
  }
}

export class SecurityIdAddedAction {
  static readonly type = '[securityClass] Security Id Added Action'

  constructor(public payload: any) {
  }
}

export class SetAddedDefaultSecurityId {
  static readonly type = '[securityClass] Set Added Default Security Id'

  constructor(public defaultSecurityId: any) {
  }
}


export class SetClassSecurityTemplateAction {
  static readonly type = '[contentEngine] Set Class Security Template Action'

  constructor(public payload: any) {
  }
}

export class SetSecurityTemplateDataSource {
  static readonly type = '[contentEngine] Set Security Template Data Source Action'

  constructor(public payload: any) {
  }
}

export class SetDefaultSecurityTemplateDataSource {
  static readonly type = '[contentEngine] Set Default Security Template Data Source Action'

  constructor(public payload: any) {
  }
}

export class SetDefaultInstanceSecurityIdAction {
  static readonly type = '[contentEngine] Set Default Instance Security Id Action'

  constructor(public id: any) {
  }
}

export class SetIsMovedFromUserToGroupOrViceVersaAction {
  static readonly type = '[contentEngine] Set Is MovedFromUserToGroupOrViceVersa Action'

  constructor(public status: boolean) {
  }
}

export class UpdateSecurityByEntityAction {
  static readonly type = '[contentEngine] Update Security By Entity Action'

  constructor(public entity: string, public payload: any) {
  }
}
