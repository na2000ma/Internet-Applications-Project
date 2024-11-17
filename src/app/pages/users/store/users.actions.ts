export class GetExampleAction {
    static readonly type = '[users] Get Example';

    constructor(public payload: any[]) {
    }
}

export class SetExampleAction {
    static readonly type = '[users] Set Example';

    constructor(public payload: any[]) {
    }
}
