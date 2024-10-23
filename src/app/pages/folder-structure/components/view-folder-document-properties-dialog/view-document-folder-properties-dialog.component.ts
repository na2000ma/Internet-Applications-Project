import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {DynamicForm} from "@app/pages/folder-structure/forms/dynamic.form";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {Store} from "@ngxs/store";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  EditFolderPropertiesAction,
  SetFolderPropertiesByIdAction,
  SetTemplateAction
} from "@app/pages/folder-structure/store/folders/folders.actions";
import {get} from "lodash-es";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {
  EditDocumentPropertiesAction,
  EditDocumentTitleAction,
  SetDocumentProperties
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {AddDocumentGeneralForm} from "@app/pages/folder-structure/forms/add-document-general.form";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'organizo-view-folder-properties-dialog',
  templateUrl: './view-document-folder-properties-dialog.component.html',
  styleUrl: './view-document-folder-properties-dialog.component.scss'
})
export class ViewDocumentFolderPropertiesDialogComponent extends UnsubscribeComponent implements AfterViewChecked {

  formDef: DynamicForm = new DynamicForm();
  generalForm: AddDocumentGeneralForm;

  constructor(
    private store: Store,
    private matDialogRef: MatDialogRef<ViewDocumentFolderPropertiesDialogComponent>,
    private folderStructureUtilsService: FolderStructureUtilsService,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    super();

    if (this.editMode) {
      this.generalForm = new AddDocumentGeneralForm(false, true);
    }

    if (get(data, 'data')) {
      this.generalForm.model = {...get(data, 'data')}
    }
  }

  get containerId() {
    return this.activatedRoute.snapshot.queryParams['containerId'];
  }

  get isFolder(): boolean {
    return get(this.data, 'isFolder') || false;
  }

  get editMode() {
    return get(this.data, 'editMode') || false;
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  closeDialog() {
    this.matDialogRef.close();
    this.store.dispatch(new SetFolderPropertiesByIdAction(null))
    this.store.dispatch(new SetDocumentProperties(null))
    this.store.dispatch(new SetTemplateAction([]))
  }

  editFolderOrDocumentProperties(value: any) {
    let payload = {
      document: {
        classDefinition: this.folderStructureUtilsService.optimizeDocumentPropertiesDataSource(get(this.store.selectSnapshot(FoldersState.template), 'template'), value),
        [this.isFolder ? 'container' : 'docMainInfo']: {
          objectId: this.containerId
        }
      }
    }

    const api = this.isFolder ? new EditFolderPropertiesAction(payload) : new EditDocumentPropertiesAction(payload)
    this.subscriptions.add(
      this.store.dispatch(api).subscribe({
        complete: () => {
          this.closeDialog();
        }
      })
    )
  }

  editDocumentOrFolder() {
    // edit mode is true when I update the document
    let payloadForProps = {
      document: {
        classDefinition: this.folderStructureUtilsService.optimizeDocumentPropertiesDataSource(get(this.store.selectSnapshot(FoldersState.template), 'template'), this.formDef.model),
        [this.isFolder ? 'container' : 'docMainInfo']: {
          objectId: this.containerId
        }
      }
    }

    let payloadForTitle = {
      domain: {
        objectId: get(this.generalForm.model, 'objectId'),
        title: get(this.generalForm.model, 'title')
      }
    }

    this.subscriptions.add(
      this.store.dispatch([
        new EditDocumentPropertiesAction(payloadForProps),
        new EditDocumentTitleAction(payloadForTitle, this.containerId)
      ]).subscribe({
        complete: () => this.closeDialog()
      })
    )
  }

  onDynamicFormValueChange(event: DynamicForm) {
    this.formDef = event;
    this.cdr.detectChanges();
  }
}
