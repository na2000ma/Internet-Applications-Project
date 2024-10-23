import {Component, Inject} from '@angular/core';
import {AddFolderGeneralForm} from "@app/pages/folder-structure/forms/add-folder-general.form";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngxs/store";
import {RenameFolderAction} from "@app/pages/folder-structure/store/folders/folders.actions";
import {get} from "lodash-es";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";

@Component({
  selector: 'organizo-rename-folder-dialog',
  templateUrl: './rename-folder-dialog.component.html',
  styleUrl: './rename-folder-dialog.component.scss'
})
export class RenameFolderDialogComponent extends UnsubscribeComponent {

  formDef: AddFolderGeneralForm = new AddFolderGeneralForm(true);

  constructor(
    private matDialogRef: MatDialogRef<RenameFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
  ) {
    super();
    if (data) {
      this.formDef.model = {...data}
    }
  }

  submit(value: any) {
    let payload = {
      containerId: get(this.data, 'objectId'),
      name: get(value, 'name')
    }
    this.subscriptions.add(
      this.store.dispatch(new RenameFolderAction(this.data, payload)).subscribe({
        complete: () => {
          this.closeDialog()
        }
      })
    )
  }

  closeDialog() {
    this.matDialogRef.close();
  }
}
