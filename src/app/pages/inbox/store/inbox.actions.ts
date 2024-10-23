export class GetUsersAndSecretary {
    static readonly type = '[inbox] Get Users And Secretary';

    constructor() {
    }
}

export class SetUsersAndSecretary {
    static readonly type = '[inbox] Set Users And Secretary';

    constructor(public payload: any[]) {
    }
}

export class LunchWorkFlowAction {
  static readonly type = '[inbox] Lunch Work Flow Action';

  constructor(public payload: any) {

  }
}

  export class GetTasks {
    static readonly type = '[inbox] Get Tasks ';
    constructor(public currentUser : any) {
    }
}

export class SetTasks {
  static readonly type = '[inbox] Set Tasks ';
  constructor(public payload : any) {
  }
}

export class CompleteTask{
  static readonly type = '[inbox] Complete Task';

  constructor(public payload : any, public taskId: any) {
  }

}
