export class GetAcceptedFilesAction {
    static readonly type = '[folders] Get Accepted Files Action';

    constructor() {
    }
}

export class SetAcceptedFilesAction {
    static readonly type = '[folders] Set Accepted Files Action';

    constructor(public payload: any) {
    }
}

export class AddFileAction {
    static readonly type = '[folders] Add File Action';

    constructor(public payload: any) {
    }
}
