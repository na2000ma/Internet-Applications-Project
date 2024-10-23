import {Component, Inject} from '@angular/core';
import {AddDocumentGeneralForm} from "@app/pages/folder-structure/forms/add-document-general.form";
import {DynamicForm} from "@app/pages/folder-structure/forms/dynamic.form";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {Store} from "@ngxs/store";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  DocumentCheckInAction,
  SetDocumentProperties
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {get} from "lodash-es";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'organizo-check-in-document-dialog',
  templateUrl: './check-in-document-dialog.component.html',
  styleUrl: './check-in-document-dialog.component.scss'
})
export class CheckInDocumentDialogComponent extends UnsubscribeComponent {

  formDef: AddDocumentGeneralForm = new AddDocumentGeneralForm(true);
  dynamicForm: DynamicForm = new DynamicForm();

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private matDialogRef: MatDialogRef<CheckInDocumentDialogComponent>,
    private folderStructureUtilsService: FolderStructureUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  get isMajor() {
    return get(this.data, 'asMajor');
  }

  get document() {
    return get(this.data, 'document');
  }

  get template() {
    return this.store.selectSnapshot(FoldersState.template);
  }

  get containerId() {
    return this.activatedRoute.snapshot.queryParams['containerId']
  }

  closeDialog() {
    this.matDialogRef.close();
    this.store.dispatch(new SetDocumentProperties(null));
  }

  submit() {
    let payload = {
      objectId: get(this.document, 'versionSeriesId'),
      type: this.isMajor ? "Major" : "Minor",
      content: get(this.formDef.model, 'content'),
      fields: this.folderStructureUtilsService.optimizeDocumentPropertiesDataSource(get(this.template, 'template'), this.dynamicForm.model)
    }
    this.subscriptions.add(
      this.store.dispatch(new DocumentCheckInAction(payload, this.containerId)).subscribe({
        complete: () => {
          this.closeDialog();
        }
      })
    )
  }

  onDynamicFormValueChange(event: DynamicForm) {
    this.dynamicForm = event;
  }
}
