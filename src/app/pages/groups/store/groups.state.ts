import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {get} from "lodash-es";
import {
  AddGroupAction,
  GetAllGroupsAction,
  GetAllMyGroupsAction,
  GetAllUsersAction,
  JoinGroupAction,
  SetGroupsAction,
  SetSelectedGroupAction,
  SetUsersAction,
  ShowGroupAction
} from "@app/pages/groups/store/groups.actions";
import {GroupsService} from "@app/pages/groups/services/groups.service";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {tap} from "rxjs";
import {ShowSuccessToast} from "@app/store/app.action";

export interface GroupsModel {
  groups: any[],
  users: any[],
  selectedGroup: any,
}

const defaults = {
  groups: [],
  users: [],
  selectedGroup: null
}

@State({
  name: 'groups',
  defaults
})
@Injectable()
export class GroupsState {

  constructor(private groupsService: GroupsService) {
  }

  @Selector()
  static groups(state: GroupsState) {
    return get(state, 'groups') || [];
  }

  @Selector()
  static users(state: GroupsState) {
    return get(state, 'users') || [];
  }

  @Selector()
  static selectedGroup(state: GroupsState) {
    return get(state, 'selectedGroup') || [];
  }

  @Action(GetAllGroupsAction)
  getAllGroups({dispatch}: StateContext<GroupsModel>) {
    return this.groupsService.getAllGroups().pipe(
      tap((response: AppHttpResponse) => {
        response.handle(data => {
          dispatch(new SetGroupsAction(get(data, 'groups')))
        })
      })
    )
  }

  @Action(SetGroupsAction)
  setGroupsAction({patchState}: StateContext<GroupsModel>, {payload}: SetGroupsAction) {
    return patchState({
      groups: payload
    })
  }

  @Action(GetAllUsersAction)
  getAllUsers({dispatch}: StateContext<GroupsModel>) {
    return this.groupsService.getAllUsers().pipe(
      tap((response: AppHttpResponse) => {
        response.handle(data => {
          dispatch(new SetUsersAction(get(data, 'users')))
        })
      })
    )
  }

  @Action(SetUsersAction)
  SetUsersAction({patchState}: StateContext<GroupsModel>, {payload}: SetUsersAction) {
    return patchState({
      users: payload
    })
  }

  @Action(AddGroupAction)
  addGroupAction({dispatch}: StateContext<GroupsModel>, {payload}: AddGroupAction) {
    return this.groupsService.addGroup(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(data => {
          dispatch(new GetAllGroupsAction());
        })
      })
    )
  }

  @Action(ShowGroupAction)
  showGroupAction({dispatch}: StateContext<GroupsModel>, {id}: ShowGroupAction) {
    return this.groupsService.showGroup(id).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(data => {
          dispatch(new SetSelectedGroupAction(data));
        })
      })
    )
  }

  @Action(SetSelectedGroupAction)
  setSelectedGroupAction({patchState}: StateContext<GroupsModel>, {payload}: SetSelectedGroupAction) {
    return patchState({
      selectedGroup: payload
    })
  }

  @Action(GetAllMyGroupsAction)
  getAllMyGroupsAction({dispatch}: StateContext<GroupsModel>) {
    return this.groupsService.getMyGroups().pipe(
      tap((response: AppHttpResponse) => {
        response.handle(data => {
          dispatch(new SetGroupsAction(get(data, 'groups')))
        })
      })
    )
  }

  @Action(JoinGroupAction)
  joinGroupAction({dispatch}: StateContext<GroupsModel>, {id}: JoinGroupAction) {
    return this.groupsService.joinGroup(id).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data) => {
            dispatch(new ShowSuccessToast(get(data, 'message')))
          },

          message => {

          },
          errors => {
            dispatch(new ShowSuccessToast("You are already in this group"))
          }
        )
      })
    )
  }

}
