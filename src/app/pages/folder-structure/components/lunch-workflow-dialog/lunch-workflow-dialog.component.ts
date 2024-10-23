import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {get} from "lodash-es";
import {Store} from "@ngxs/store";
import {LunchWorkFlowAction} from "@app/pages/folder-structure/store/documents/documents.actions";
import {WorkFlowForm} from "@app/pages/folder-structure/forms/work-flow.form";

@Component({
  selector: 'organizo-lunch-workflow-dialog',
  templateUrl: './lunch-workflow-dialog.component.html',
  styleUrl: './lunch-workflow-dialog.component.scss'
})
export class LunchWorkflowDialogComponent {

  formDef: WorkFlowForm = new WorkFlowForm();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<LunchWorkflowDialogComponent>,
    private store: Store
  ) {
    if (data) {
      this.formDef = new WorkFlowForm(data)
    }
  }

  closeDialog() {
    this.matDialogRef.close()
  }

  submit(model: any) {

    let content = get(model, 'content');
    let users = this.getKeyFromObject(get(model, 'users'))
    let secretary = this.getKeyFromObject(get(model, 'secretary'))

    let payload: any;
    payload = {
      variables: {
        content: {
          body: content,
          approved: false
        },
        users: users || [],
        secretary: 'mariasulaiman'  //secretary || []
      }
    }

    this.store.dispatch(new LunchWorkFlowAction(payload))
    this.matDialogRef.close()
  }


  // private Functions

  getKeyFromObject(data: Object): any[] {

    return Object.entries(data).filter(item => item[1] === true).map(item => item[0])
  }

}
