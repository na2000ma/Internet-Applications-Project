import {Component, Inject} from '@angular/core';
import {AddGroupForm} from "@app/pages/groups/forms/add-group.form";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngxs/store";
import {AddGroupAction} from "@app/pages/groups/store/groups.actions";
import {Observable} from "rxjs";

@Component({
  selector: 'organizo-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrl: './add-group-dialog.component.scss'
})
export class AddGroupDialogComponent {


  formDef = new AddGroupForm();

  editMode: boolean = false;

  constructor(
    private store: Store,
    private matDialogRef: MatDialogRef<AddGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<any>,
    ) {
    if (this.data) {
      this.editMode = true;
      this.data.subscribe(value => this.formDef.model = {...value})
    }
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  submit(model: any) {
    this.store.dispatch(new AddGroupAction({...model})).subscribe({
      complete: () => this.closeDialog()
    })
  }
}
