import { Selector, Action, State, StateContext} from "@ngxs/store";
import { Injectable } from "@angular/core";
import { get } from "lodash-es";
import { GetExampleAction, SetExampleAction} from "./users.actions";

export interface UsersModel {
  'example': any[]
}

const defaults = {
  example: []
}

@State({
  name: 'users',
  defaults
})
@Injectable()
export class UsersState {

  @Selector()
  static example(state: UsersState) {
    return get(state, 'example') || [];
  }

  @Action(GetExampleAction)
  getExampleAction({dispatch}: StateContext<UsersModel>, {payload}: GetExampleAction) {
    return dispatch(new SetExampleAction(payload));
  }

  @Action(SetExampleAction)
  setExampleAction({patchState}: StateContext<UsersModel>, {payload}: SetExampleAction) {
    return patchState({
      example: payload
    })
  }
}
