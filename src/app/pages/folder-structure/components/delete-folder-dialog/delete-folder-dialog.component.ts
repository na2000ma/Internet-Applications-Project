import {Component} from '@angular/core';
import {DeleteFolderForm} from "@app/pages/folder-structure/forms/delete-folder.form";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'organizo-delete-folder-dialog',
  templateUrl: './delete-folder-dialog.component.html',
  styleUrl: './delete-folder-dialog.component.scss'
})
export class DeleteFolderDialogComponent {
  formDef: DeleteFolderForm = new DeleteFolderForm();

  constructor(
    private matDialogRef: MatDialogRef<DeleteFolderDialogComponent>) {
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  submit(model: any) {
    this.matDialogRef.close(model);
  }
}
