import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {InboxDriverApis} from "@app/pages/inbox/drivers/inbox-driver.api";

@Injectable({
  providedIn: 'root'
})
export class InboxService {
  constructor(private _httpClient: HttpClient)
  {
  }

  getUsersAndSecretary() {
    return this._httpClient.get(InboxDriverApis.getUsersAndSecretary)
  }

  lunchWorkFlow(payload: any) {
    return this._httpClient.post(InboxDriverApis.lunchWorkFlow, payload, {
      params: {
        processKey: 'users-loop'    // This is static only for test at beginning
      }
    })
  }

  getTasks(currentUser: any) {
    return this._httpClient.get(InboxDriverApis.getTasks, {
      params: {
        userId: currentUser
      }
    })
  }

  completeTask(payload: any, taskId: any) {
    return this._httpClient.post(InboxDriverApis.completeTask, payload, {
      params: {
        taskId: taskId
      }
    })
  }
}
