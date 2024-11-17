export class GetAllGroupsAction {
    static readonly type = '[groups] Get All Groups Action';

    constructor() {
    }
}

export class SetGroupsAction {
    static readonly type = '[groups] Set All Groups Action';

    constructor(public payload: any[]) {
    }
}

export class GetAllUsersAction {
  static readonly type = '[groups] Get All Users Action';

  constructor() {
  }
}

export class SetUsersAction {
  static readonly type = '[groups] Set All Users Action';

  constructor(public payload: any[]) {
  }
}

export class AddGroupAction {
  static readonly type = '[groups] Add Group Action';

  constructor(public payload: any) {
  }
}

export class ShowGroupAction {
  static readonly type = '[groups] Show Group Action';

  constructor(public id: any) {
  }
}

export class SetSelectedGroupAction {
  static readonly type = '[groups] Set Selected Group Action';

  constructor(public payload: any) {
  }
}

export class GetAllMyGroupsAction {
  static readonly type = '[groups] Get All My Groups Action';

  constructor() {
  }
}

export class JoinGroupAction {
  static readonly type = '[groups] Join Group Action';

  constructor(public id: any) {
  }
}
