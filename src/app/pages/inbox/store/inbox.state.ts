import { Selector, Action, State, StateContext} from "@ngxs/store";
import { Injectable } from "@angular/core";
import { get } from "lodash-es";
import {asapScheduler, tap} from "rxjs";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {ShowFailedToast, ShowSuccessToast} from "@app/store/app.action";
import {InboxService} from "@app/pages/inbox/services/inbox.service";
import {
  CompleteTask,
  GetTasks,
  GetUsersAndSecretary,
  LunchWorkFlowAction, SetTasks,
  SetUsersAndSecretary
} from "@app/pages/inbox/store/inbox.actions";

export interface MailboxModel {
  users: any[],
  secretary: any[],
  tasks: any[]
}

const defaults = {
  users: [],
  secretary:[],
  tasks: []
}

@State({
  name: 'mailbox',
  defaults
})
@Injectable()
export class InboxState {

  constructor(private _service : InboxService) {
  }

  @Selector()
  static users(state: InboxState) {
    return get(state, 'users') || [];
  }

  @Selector()
  static secretary(state: InboxState) {
    return get(state, 'secretary') || [];
  }

  @Selector()
  static tasks(state: InboxState) {
    return get(state, 'tasks') || [];
  }

  @Action(GetUsersAndSecretary)
  getUsersAndSecretary({dispatch}: StateContext<MailboxModel>) {
    return  this._service.getUsersAndSecretary().pipe(
      tap( (response : AppHttpResponse) =>{
        response.handle(
          data => {
           let  newData = get(data,'list')?.map(item => {
              return {
                ...item,
                fullName : get(item,'firstName')+ ' ' + get(item,'lastName')
              }
            })
          dispatch(new SetUsersAndSecretary(newData))
          },
          () =>{
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
        }
      ))
  }

  @Action(SetUsersAndSecretary)
  setUsersAndSecretary({patchState}: StateContext<MailboxModel>, {payload}: SetUsersAndSecretary) {
    return patchState({
      users: payload,
      secretary: payload
    })
  }

  @Action(LunchWorkFlowAction)
  lunchWorkFlow({dispatch}:StateContext<MailboxModel>,{payload}:LunchWorkFlowAction){
    return this._service.lunchWorkFlow(payload).pipe(
      tap(
        (response: AppHttpResponse) =>{
          response.handle(
            ()=>{
              asapScheduler.schedule(()=> dispatch(new ShowSuccessToast()))
            },
            ()=>{
              asapScheduler.schedule(()=> dispatch(new ShowFailedToast()))
            }
          )
        }
      ))
  }

  @Action(GetTasks)
  getTasks({dispatch}:StateContext<MailboxModel> , {currentUser}: GetTasks){
    return this._service.getTasks(currentUser).pipe(
      tap(
        (response: AppHttpResponse) =>{
          response.handle(
            (data)=>{
              dispatch(new SetTasks(data))
            }
          )
        }
      )
    )
  }

  @Action(SetTasks)
  setTasks({patchState}:StateContext<MailboxModel>,{payload}:SetTasks){
    patchState({
      tasks: payload
    })
  }

  @Action(CompleteTask)
  completeTask({}: StateContext<MailboxModel>,{payload,taskId}:CompleteTask){
    return this._service.completeTask(payload,taskId).pipe(
      tap(
        (response: AppHttpResponse) =>{
          response.handle(
            ()=>{}
          )
        }
      )
    )
  }

}
