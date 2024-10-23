import {Injectable} from "@angular/core";
import {inject} from "@organizo/injector/app-injector";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {Store} from "@ngxs/store";
import {
  GetAvailableClassificationsByContainerIdForDocument,
  GetAvailableClassificationsForFolder,
  GetAvailableDocumentClasses,
  GetDocumentFolderFieldIn,
  GetDocumentPropertiesAction,
  GetDocumentVersions,
  GetTreeDocumentFoldersFieldIn,
  SetSelectedDocument
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {get} from "lodash-es";
import {GetClassSecurityTemplateByIdAction} from "@app/pages/security-template/store/class-security.action";
import {DocumentPropertiesStepsEnum} from "@app/pages/folder-structure/enums/document-properties-steps.enum";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {
  AddEditViewDocumentPropertiesDialogComponent
} from "@app/pages/folder-structure/components/add-edit-view-document-folder-dialog/add-edit-view-document-properties-dialog.component";
import {
  GetFolderPropertiesByIdAction,
  GetRelatedFieldsAction,
  GetTemplateByClassificationIdAction,
  SetSelectedNodeAction
} from "@app/pages/folder-structure/store/folders/folders.actions";
import {
  ViewDocumentFolderPropertiesDialogComponent
} from "@app/pages/folder-structure/components/view-folder-document-properties-dialog/view-document-folder-properties-dialog.component";
import {
  CheckInDocumentDialogComponent
} from "@app/pages/folder-structure/components/documents/check-in-document-dialog/check-in-document-dialog.component";

@Injectable({
  providedIn: "root"
})

export class FolderStructureUtilsService {
  openDocumentOrFolderPropertiesDialog(data?: { data: any, selectedStep?: number }) {
    const matDialog = inject(MatDialog);
    return matDialog.open(AddEditViewDocumentPropertiesDialogComponent, {
      panelClass: [
        "h-[90vh]", "w-[60vw]", "max-sm:w-full", "max-sm:h-[70vh]", "max-[1200px]:w-[50vw]",
        "absolute", "max-sm:bottom-[4.5vh]", "bottom-[2vh]",
        "ltr:right-[0vw]", "rtl:left-[0vw]"
      ],
      enterAnimationDuration: '0.4s',
      exitAnimationDuration: '200ms',
      data: {...data}
    });
  }

  getAllAPIsForEditProperties(subscriptions: Subscription, rowData: any, inFolderDialog: boolean, selectedStep?: number) {
    const store = inject(Store);
    if (rowData) {
      if (!inFolderDialog) {
        // payload to request tree folder field in
        const payload = {
          parentContainerId: null,
          classificationId: get(rowData, 'classificationId'),
          documentId: get(rowData, 'objectId')
        }
        subscriptions.add(
          store.dispatch([
            new GetDocumentVersions(get(rowData, 'versionSeriesId')),
            new GetDocumentPropertiesAction(get(rowData, 'objectId'), get(rowData, 'tableName')),
            new GetTemplateByClassificationIdAction({
              classificationId: get(rowData, 'classificationId'),
              templateType: 1
            }),
            new GetRelatedFieldsAction(get(rowData, 'classificationId')),
            new GetClassSecurityTemplateByIdAction(get(rowData, 'securityId')),
            new GetDocumentFolderFieldIn(get(rowData, 'objectId')),
            new GetTreeDocumentFoldersFieldIn(payload),
            new SetSelectedDocument(rowData)
          ])
            .subscribe({
              complete: () => {
                subscriptions.add(
                  this
                    .openDocumentOrFolderPropertiesDialog({data: rowData, selectedStep: selectedStep})
                    .afterOpened()
                    .subscribe({
                      complete: () => {
                        const service = inject(ObjectUtilsService)
                        service.addQueryParams('documentId', get(rowData, 'objectId'))
                        if (selectedStep === DocumentPropertiesStepsEnum.Security) {
                          service.addQueryParams('mode', 'securityTemplate')
                        }
                      }
                    })
                )
              }
            })
        )
      } else {
        subscriptions.add(
          store.dispatch([
            new GetAvailableClassificationsForFolder(),
            new GetDocumentPropertiesAction(get(rowData, 'objectId'), get(rowData, 'tableName')),
            new GetAvailableDocumentClasses()
          ])
            .subscribe({
              complete: () => {
                this.openDocumentOrFolderPropertiesDialog({data: rowData})
              }
            })
        )
      }
    } else {
      const activatedRoute = inject(ActivatedRoute);
      if (inFolderDialog) {
        subscriptions.add(
          store.dispatch([
            new GetAvailableClassificationsForFolder(),
            new GetAvailableDocumentClasses()
          ])
            .subscribe({
              complete: () => {
                this.openDocumentOrFolderPropertiesDialog({data: null})
              }
            })
        )
      } else {
        const containerId = activatedRoute.snapshot.queryParams['containerId'];
        subscriptions.add(
          store.dispatch([
            new GetAvailableClassificationsByContainerIdForDocument(containerId),
            new GetDocumentFolderFieldIn(containerId)
          ])
            .subscribe({
              complete: () => {
                this.openDocumentOrFolderPropertiesDialog({data: null})
              }
            })
        )
      }
    }
  }

  openFolderOrDocumentPropertiesDialog(subscriptions: Subscription, rowData: any, isFolder: boolean = true, editMode: boolean = false) {
    const store = inject(Store);
    const matDialog = inject(MatDialog);
    if (isFolder) {
      store.dispatch(new SetSelectedNodeAction(rowData));
    } else {
      store.dispatch(new SetSelectedDocument(rowData));
    }

    const folderOrDocumentPropertiesAPI =
      isFolder ?
        new GetFolderPropertiesByIdAction({objectId: get(rowData, 'objectId'), tableName: get(rowData, 'tableName')}) :
        new GetDocumentPropertiesAction(get(rowData, 'objectId'), get(rowData, 'tableName'))
    subscriptions.add(
      store.dispatch([
        new GetTemplateByClassificationIdAction({
          classificationId: isFolder ? get(rowData, 'classificationClass.objectId') : get(rowData, 'classificationId'),
          templateType: 1
        }),
        new GetRelatedFieldsAction(get(rowData, 'classificationClass.objectId')),
        folderOrDocumentPropertiesAPI
      ]).subscribe({
        complete: () => {
          matDialog.open(ViewDocumentFolderPropertiesDialogComponent, {
            panelClass: [
              "h-[90vh]", "w-[30vw]", "max-sm:w-full", "max-sm:h-[70vh]", "max-[1200px]:w-[50vw]",
              "absolute", "max-sm:bottom-[4.5vh]", "bottom-[2vh]",
              "ltr:right-[4.5vw]", "rtl:left-[4.5vw]"
            ],
            enterAnimationDuration: '0.4s',
            exitAnimationDuration: '200ms',
            data: {isFolder: isFolder, editMode: editMode, data: editMode ? rowData : null}
          })
        }
      })
    )
  }

  openCheckInDialog(subscriptions: Subscription, rowData: any, asMajor: boolean) {
    const store = inject(Store);
    const matDialog = inject(MatDialog);
    subscriptions.add(
      store.dispatch([
        new GetTemplateByClassificationIdAction({
          classificationId: get(rowData, 'classificationId'),
          templateType: 1
        }),
        new GetRelatedFieldsAction(get(rowData, 'classificationId')),
        new GetDocumentPropertiesAction(get(rowData, 'objectId'), get(rowData, 'tableName')),
      ]).subscribe({
        complete: () => {
          matDialog.open(CheckInDocumentDialogComponent, {
            panelClass: [
              "h-[90vh]", "w-[30vw]", "max-sm:w-full", "max-sm:h-[70vh]", "max-[1200px]:w-[50vw]",
              "absolute", "max-sm:bottom-[4.5vh]", "bottom-[2vh]",
              "ltr:right-[4.5vw]", "rtl:left-[4.5vw]"
            ],
            enterAnimationDuration: '0.4s',
            exitAnimationDuration: '200ms',
            data: {document: rowData, asMajor: asMajor}
          })
        }
      })
    )
  }

  optimizeDocumentPropertiesDataSource(fields: any[], values: any[]) {
    let response: any[] = [];
    if (fields) {
      let template: any[] = [...fields];
      template.forEach(field => {
        let newField: any = {};
        if (field.fieldGroup) {
          response.push(...this.optimizeDocumentPropertiesDataSource(field.fieldGroup, values));
        } else {
          newField = {
            type: get(field, 'type'),
            key: get(field, 'key'),
            props: {
              type: get(field.props, 'type') || '',
              label: get(field.props, 'label') || null,
              labelProp: get(field.props, 'labelProp') || null,
              valueProp: get(field.props, 'valueProp') || null,
              required: get(field.props, 'required') || false,
              tableName: get(field.props, 'tableName') || null
            }
          }
          if (newField.key && values[newField.key] !== undefined) {
            newField.value = values[newField.key];
          }
          response.push(newField);
        }
      });
    }
    return response;
  }

  optimizeDataSourceForFilteredDocuments(fields: any[], values: any): any[] {
    let result: any[] = [];
    const processFields = (fields: any[]) => {
      fields.forEach(field => {
        if (field.fieldGroup) {
          processFields(field.fieldGroup);
        } else {
          let key = values[field.key];
          if (key) {
            result.push({
              key: get(field, 'key'),
              tableName: get(field, 'props.tableName'),
              operator: '=',//((get(field, 'type') === 'input' && get(field, 'props.type') === 'number') || get(field, 'type') === 'date') ? '=' : 'LIKE',
              value: get(values, get(field, 'key'))
            });
          }
        }
      });
    };
    processFields(fields);
    return result;
  }

  setAllCheckedFalse(data: any[]): Array<any> {
    const setCheckedFalse = (item: any): any => {
      // Create a new object with updated isChecked property set to false
      return {
        ...item,
        isChecked: false,
        // Recursively update the children array if it exists
        children: item.children ? item.children.map((child: any) => setCheckedFalse(child)) : []
      };
    };

    // Return a new array with all config items updated
    return data.map(configItem => setCheckedFalse(configItem));
  }
}

