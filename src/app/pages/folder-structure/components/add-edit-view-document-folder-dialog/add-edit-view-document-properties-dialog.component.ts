import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {get} from "lodash-es";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {AddDocumentGeneralForm} from "@app/pages/folder-structure/forms/add-document-general.form";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {ActivatedRoute} from "@angular/router";
import {AddFolderGeneralForm} from "@app/pages/folder-structure/forms/add-folder-general.form";
import {Store} from "@ngxs/store";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {
  AddDocumentAction,
  SetDocumentFolderFieldIn,
  SetDocumentProperties,
  SetGeneralFormValue
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {DynamicForm} from "@app/pages/folder-structure/forms/dynamic.form";
import {SecurityClassState} from "@app/pages/security-template/store/class-security.state";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {
  AddFolderAction,
  SetFolderPropertiesByIdAction,
  SetTemplateAction
} from "@app/pages/folder-structure/store/folders/folders.actions";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {
  AddSecurityTemplateAction,
  SecurityIdAddedAction,
  SetClassSecurityTemplateAction
} from "@app/pages/security-template/store/class-security.action";
import {lastValueFrom} from "rxjs";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'organizo-add-edit-view-document-properties-dialog',
  templateUrl: './add-edit-view-document-properties-dialog.component.html',
  styleUrls: ['./add-edit-view-document-properties-dialog.component.scss', '../../../../../@organizo/styles/mat-stepper.scss']
})
export class AddEditViewDocumentPropertiesDialogComponent extends UnsubscribeComponent implements OnInit, AfterViewChecked {

  addDocumentOrFolderGeneralForm: AddDocumentGeneralForm | AddFolderGeneralForm;
  dynamicForm: DynamicForm = new DynamicForm();
  editMode: boolean = false;
  selectedNodeFromFolderTree: any;
  classType: string = 'Document';
  protected readonly get = get;
  readonly #selectedIndex: number = 0;

  constructor(
    private matDialogRef: MatDialogRef<AddEditViewDocumentPropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private objectUtilsService: ObjectUtilsService,
    private folderStructureUtilsService: FolderStructureUtilsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();

    if (get(data, 'data')) {
      this.editMode = true;
      if (get(data, 'selectedStep')) {
        this.#selectedIndex = get(data, 'selectedStep');
      }
    } else {
      this.editMode = false;
    }

    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['dialog']) {
          if (params['dialog'].includes('Folder')) {
            this.addDocumentOrFolderGeneralForm = new AddFolderGeneralForm();
            this.classType = 'Folder';
          }
          if (params['dialog'].includes('Document')) {
            this.addDocumentOrFolderGeneralForm = new AddDocumentGeneralForm();
            this.classType = 'Document';
          }
        } else {
          this.addDocumentOrFolderGeneralForm = new AddDocumentGeneralForm();
          this.classType = 'Document';
        }
      })
    )

  }

  get inValid() {
    return !(this.addDocumentOrFolderGeneralForm.group.valid && this.dynamicForm.group.valid);
  }

  get selectedIndex() {
    return this.#selectedIndex;
  }

  get containerId() {
    return this.activatedRoute.snapshot.queryParams['containerId'] || get(this.store.selectSnapshot(FoldersState.selectedNode), 'objectId') || null;
  }

  get userId() {
    return get(JSON.parse(localStorage.getItem('authUser')), 'id');
  }

  get userSId() {
    return get(JSON.parse(localStorage.getItem('authUser')), 'sid');
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    this.subscriptions.add(
      this.addDocumentOrFolderGeneralForm.group.valueChanges.subscribe(value => {
        if (value) {
          this.store.dispatch(new SetGeneralFormValue(value))
        }
      })
    )

    this.selectedNodeFromFolderTree = this.store.selectSnapshot(FoldersState.selectedNode);
    await lastValueFrom(this.store.dispatch(new SetDocumentFolderFieldIn([this.selectedNodeFromFolderTree])))
  }

  closeDialog() {
    try {
      this.objectUtilsService.removeFromQueryParamByKey(['mode', 'dialog', 'classType']);
      this.matDialogRef.close();
      this.document.getElementsByClassName('cdk-overlay-pane')[0].remove();
      this.store.dispatch(new SetClassSecurityTemplateAction(null));
      this.store.dispatch(new SetGeneralFormValue(null));
      this.store.dispatch(new SetDocumentProperties(null));
      this.store.dispatch(new SetFolderPropertiesByIdAction(null));
      this.store.dispatch(new SetTemplateAction([]));
      this.store.dispatch(new SecurityIdAddedAction(null));
    } catch (error) {
      console.error('Error while closing dialog:', error);
    }
  }

  async onSelectionChange(event: any) {
    await this.objectUtilsService.addQueryParams('mode', 'securityTemplate').then(
      (value) => {
        if (value) {
          this.objectUtilsService.addQueryParams('securityFeatureType', this.classType)
        }
      }
    )
    this.setGeneralFormValueInModel();
  }

  onDynamicFormValueChange(event: DynamicForm) {
    this.dynamicForm = event
  }

  submit() {
    if (this.classType === 'Document') {
      this.addDocument();
    } else {
      this.addFolder();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  async addSecurityBeforeAddingDocumentOrFolder() {
    let payload = {
      creatorId: this.userId,
      creatorSID: this.userSId,
      defaultSecurityTemplateId: this.store.selectSnapshot(SecurityClassState.defaultInstanceSecurityId),
      securityTemplate: []
    }
    await lastValueFrom(this.store.dispatch(new AddSecurityTemplateAction(payload)))
  }

  private setGeneralFormValueInModel() {
    this.subscriptions.add(
      this.store.select(DocumentsState.generalFormValue).subscribe(data => {
        if (data) {
          this.addDocumentOrFolderGeneralForm.model = {...data}
        }
      })
    )
  }

  private customizeFolderFieldInDataSource(data: any[]) {
    let response = [];
    (data || []).forEach(item => {
      response.push({
        objectId: get(item, "objectId")
      })
    })
    return response;
  }

  private async addDocument() {
    let payload: any = {};
    if (this.store.selectSnapshot(SecurityClassState.securityIdAdded)) {
      payload = {
        document: {
          docMainInfo: {
            securityId: this.store.selectSnapshot(SecurityClassState.securityIdAdded)
          }
        }
      }
    } else {
      await this.addSecurityBeforeAddingDocumentOrFolder().finally(() => {
        payload = {
          document: {
            docMainInfo: {
              securityId: this.store.selectSnapshot(SecurityClassState.securityIdAdded)
            }
          }
        }
      })
    }

    payload = {
      document: {
        classDefinition: this.folderStructureUtilsService.optimizeDocumentPropertiesDataSource(get(this.store.selectSnapshot(FoldersState.template), 'template'), this.dynamicForm.model),
        docMainInfo: {
          ...payload.document.docMainInfo,
          containers: this.customizeFolderFieldInDataSource(this.store.selectSnapshot(DocumentsState.folderFieldIn)),
          classificationClass: {
            objectId: get(this.addDocumentOrFolderGeneralForm.model, 'classification')
          },
          title: get(this.addDocumentOrFolderGeneralForm.model, 'title')
        }
      },
      content: get(this.addDocumentOrFolderGeneralForm.model, 'content')
    }
    this.closeDialog();
    this.store.dispatch(new AddDocumentAction(payload, this.containerId));
  }

  private async addFolder() {
    let payload: any = {};
    if (this.store.selectSnapshot(SecurityClassState.securityIdAdded)) {
      payload = {
        document: {
          container: {
            securityId: this.store.selectSnapshot(SecurityClassState.securityIdAdded)
          }
        }
      }
    } else {
      await this.addSecurityBeforeAddingDocumentOrFolder().finally(() => {
        payload = {
          document: {
            container: {
              securityId: this.store.selectSnapshot(SecurityClassState.securityIdAdded)
            }
          }
        }
      })
    }
    payload = {
      document: {
        classDefinition: this.folderStructureUtilsService.optimizeDocumentPropertiesDataSource(get(this.store.selectSnapshot(FoldersState.template), 'template'), this.dynamicForm.model),
        container: {
          ...payload.document.container,
          classificationClass: {
            objectId: get(this.addDocumentOrFolderGeneralForm.model, 'classification')
          },
          securityId: this.store.selectSnapshot(SecurityClassState.securityIdAdded),
          name: get(this.addDocumentOrFolderGeneralForm.model, 'name'),
          parentContainer: this.containerId ? {objectId: this.containerId} : null,
          availableDocumentClass: {
            objectId: get(this.addDocumentOrFolderGeneralForm.model, 'availableDocumentClass')
          }
        }
      }
    }
    const selectedNode = this.store.selectSnapshot(FoldersState.selectedNode);
    this.closeDialog();
    this.store.dispatch(new AddFolderAction(payload, this.containerId, selectedNode))
  }
}
