import {Component, Inject} from '@angular/core';
import {Store} from "@ngxs/store";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {AddFolderForm} from "@app/pages/folders/forms/add-folder.form";
import {ActivatedRoute} from "@angular/router";
import {AddFileAction} from "@app/pages/folders/store/folders.actions";

@Component({
  selector: 'organizo-add-folder-dialog',
  templateUrl: './add-folder-dialog.component.html',
  styleUrl: './add-folder-dialog.component.scss'
})
export class AddFolderDialogComponent {

  formDef = new AddFolderForm();

  editMode: boolean = false;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private matDialogRef: MatDialogRef<AddFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<any>,
  ) {
    if (this.data) {
      this.editMode = true;
      this.data.subscribe(value => this.formDef.model = {...value})
    }
  }

  get groupId() {
    return this.activatedRoute.snapshot.queryParams['groupId'];
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  submit(model: any) {
    debugger
    let payload = {
      ...model,
      group_id: this.groupId
    }
    this.store.dispatch(new AddFileAction({...payload})).subscribe({
      complete: () => this.closeDialog()
    })
  }

}
