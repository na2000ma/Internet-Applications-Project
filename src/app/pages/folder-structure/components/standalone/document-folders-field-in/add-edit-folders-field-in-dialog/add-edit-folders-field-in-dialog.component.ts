import {Component, Inject} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {TreeComponent} from "@organizo/tree/components/tree.component";
import {
  DocumentFoldersFieldInTree,
  FolderFieldInNode
} from "@app/pages/folder-structure/trees/document-folders-field-in.tree";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {get} from "lodash-es";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {SetDocumentFolderFieldIn} from "@app/pages/folder-structure/store/documents/documents.actions";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";

@Component({
  selector: 'organizo-add-edit-folders-field-in-dialog',
  templateUrl: './add-edit-folders-field-in-dialog.component.html',
  styleUrl: './add-edit-folders-field-in-dialog.component.scss',
  imports: [
    TranslateModule,
    MatIcon,
    MatButton,
    TreeComponent
  ],
  standalone: true
})
export class AddEditFoldersFieldInDialogComponent extends UnsubscribeComponent {
  treeDef: DocumentFoldersFieldInTree = new DocumentFoldersFieldInTree();
  editMode = true;
  containerPaths = [];

  constructor(private matDialogRef: MatDialogRef<AddEditFoldersFieldInDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private store: Store) {
    super();
    if (get(data, 'editMode') == false) {
      if (data) {
        this.treeDef = new DocumentFoldersFieldInTree(get(data,'classificationId'),get(data,'editMode'));
      }
    } else {
      const selectedDocument = store.selectSnapshot(DocumentsState.selectedDocument);
       this.treeDef = new DocumentFoldersFieldInTree(get(selectedDocument,'classificationId'),get(data,'editMode'),get(selectedDocument,'objectId'));
    }

  }

  // Save the data in grid after get the container path from dialog
  saveEditDialogData() {
    this.containerPathForCheckedItem()
    this.subscriptions.add(this.store.dispatch(new SetDocumentFolderFieldIn([...this.containerPaths])).subscribe({
        complete: () => this.matDialogRef.close()
      }
    ))
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  containerPathForCheckedItem() {
    const store = inject(Store);
    this.containerPaths = [];
    this.subscriptions.add(
      store.select(DocumentsState.foldersFieldInTree).subscribe(
        (data) => {
          data.forEach((item: FolderFieldInNode) => {
            this.getCheckedNodes(item);
          })
        }
      )
    )

  }

  getCheckedNodes(node: FolderFieldInNode): any {
    if (!node) {
      return null;
    }

    if (this.treeDef.customizeIsChecked(node)) {

      this.containerPaths.push(node);
    }

    if (this.treeDef.customizeHasChildren(node)) {
      (node.children || []).forEach((child: FolderFieldInNode) => {
        this.getCheckedNodes(child)
      })
    }
    return;
  }

}
