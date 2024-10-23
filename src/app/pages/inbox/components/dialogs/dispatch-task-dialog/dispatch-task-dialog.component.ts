import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {get} from "lodash-es";
import {Store} from "@ngxs/store";
import {lastValueFrom} from "rxjs";
import {AuthState} from "@app/pages/auth/store/auth.state";
import {CompleteTask, GetTasks} from "@app/pages/inbox/store/inbox.actions";
import {DispatchTaskForm} from "@app/pages/inbox/forms/dispatch-task.form";

@Component({
  selector: 'organizo-dispatch-task-dialog',
  templateUrl: './dispatch-task-dialog.component.html',
  styleUrl: './dispatch-task-dialog.component.scss'
})

export class DispatchTaskDialogComponent {

  formDef: DispatchTaskForm = new DispatchTaskForm();
  selectedTask: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<DispatchTaskDialogComponent>,
    private store: Store,
  ) {
    if (data) {
      this.formDef = new DispatchTaskForm(get(data, 'users'))
      this.selectedTask = get(data, 'selectedTask')
    }
  }

  async submit(model: any) {

    let payload: any;

    payload = {
      variables: {
        content: {
          body: get(this.selectedTask, 'properties.content.body'),
          approved: get(model, 'status')
        },
        users: this._getKeyFromObject(get(model, 'users')) || []
      }
    }

    if (get(payload, 'users')?.length == 0) delete payload['variables.users']

    await lastValueFrom(this.store.dispatch(new CompleteTask(payload, get(this.selectedTask, 'taskId'))))

    const currentUser = this.store.selectSnapshot(AuthState.authUser);
    this.store.dispatch(new GetTasks(get(currentUser, 'loginName')))
    this.matDialogRef.close();
  }

  closeDialog() {
    this.matDialogRef.close()
  }

  // private functions
  private _getKeyFromObject(data: Object): any[] {

    if (data) return Object.entries(data).filter(item => item[1] === true)
      .map(item => item[0])

    else return []
  }
}
