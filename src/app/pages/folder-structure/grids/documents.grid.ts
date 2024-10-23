import {lastValueFrom, Observable, Subscription} from "rxjs";
import {BaseGrid} from "@organizo/dx-grid/models/base-grid";
import {BaseGridConfiguration} from "@organizo/dx-grid/models/base-grid-config";
import {CellType, CellTypeName} from "@organizo/dx-grid-cell-templates/enums/cell.types";
import {
  GridTypeWithIconModel
} from "@organizo/dx-grid-cell-templates/components/type-with-icon/type-with-icon.component";
import {get} from "lodash-es";
import moment from "moment";
import {GridIconModel} from "@organizo/dx-grid-cell-templates/components/grid-icon/grid-icon.component";
import {GridMatMenuModel} from "@organizo/dx-grid-cell-templates/components/mat-menu/mat-menu.component";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {OrganizoDrawerComponent} from "@organizo/components/drawer/drawer.component";
import {GridValueGetterModel} from "@organizo/dx-grid-cell-templates/components/value-getter/value-getter.component";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {
  DocumentCancelCheckOutAction,
  DocumentCheckOutAction,
  GetDocumentContentById,
  SetSelectedDocument,
  SetViewContent
} from "../store/documents/documents.actions";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {DocumentPropertiesStepsEnum} from "@app/pages/folder-structure/enums/document-properties-steps.enum";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {
  DeleteDocumentDialogComponent
} from "@app/pages/folder-structure/components/documents/delete-document-dialog/delete-document-dialog.component";
import {Permissions} from "@app/pages/security-template/dummy-data/permissions";
import {GetUsersAndSecretary} from "@app/pages/inbox/store/inbox.actions";

import {InboxState} from "@app/pages/inbox/store/inbox.state";
import {
  LunchWorkflowDialogComponent
} from "@app/pages/folder-structure/components/lunch-workflow-dialog/lunch-workflow-dialog.component";
import {Workbook} from "exceljs";

export class DocumentsGrid implements BaseGrid {
  store = inject(Store);
  objectUtilsService = inject(ObjectUtilsService);
  folderStructureUtilsService = inject(FolderStructureUtilsService);
  matDialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);

  subscriptions: Subscription = new Subscription();
  dataSource$: Observable<any> = inject(Store).select(DocumentsState.documents);
  gridConfig: BaseGridConfiguration = {
    showColumnHeaders: true,
    allowColumnResizing: false,
    columnAutoWidth: false,
    enableColumnChooser: false,
    // enableColumnFixed must be false
    enableColumnFixed: false,
    enableColumnsGrouping: false,
    enableGridFilter: false,
    enableSearchPanel: true,
    showColumnLines: false,
    showBorders: false,
    showRowLines: false,
    rowAlternationEnabled: false,
    enableDetails: false,
    hoverStateEnabled: true,
    enableExport: true,
    templateDef: {
      'lock': CellType[CellTypeName.MatIcon],
      'document': CellType[CellTypeName.TypeWithIcon],
      'creationDate': CellType[CellTypeName.ValueGetter],
      'modifiedDate': CellType[CellTypeName.ValueGetter],
      'download': CellType[CellTypeName.MatIcon],
      'edit': CellType[CellTypeName.MatIcon],
      'trash': CellType[CellTypeName.MatIcon],
      'mat-menu': CellType[CellTypeName.MatMenu]
    },
    columnsDef: [
      {
        caption: '',
        width: '5%',
        dataField: 'lock',
        cellTemplate: 'lock',
        templateOptions: {
          icon: ({cellData}) => cellData ? 'organizo-outline-icons:lock-closed' : 'organizo-outline-icons:lock-open'
        } as GridIconModel
      },
      {
        caption: 'documents.title',
        dataField: 'title',
        cellTemplate: 'document',
        width: '25%',
        templateOptions: {
          type: 'document',
          fileType: rowData => get(rowData, 'mimeType'),
          class: 'flex items-center justify-center h-full w-full',
        } as GridTypeWithIconModel
      },
      {
        caption: 'documents.creationDate',
        dataField: 'creationDate',
        cellTemplate: 'creationDate',
        width: '25%',
        templateOptions: {
          valueGetter: cellData => cellData ? moment(cellData).format('YYYY-MM-DD hh:mm A') : null
        } as GridValueGetterModel
      },
      {
        caption: 'documents.modifiedDate',
        dataField: 'modifiedDate',
        cellTemplate: 'modifiedDate',
        width: '25%',
        templateOptions: {
          valueGetter: cellData => cellData ? moment(cellData).format('YYYY-MM-DD hh:mm A') : null
        } as GridValueGetterModel
      },
      {
        width: '5%',
        cellTemplate: 'download',
        templateOptions: {
          icon: 'organizo-outline-icons:download',
          matTooltip: 'Download',
          handle: ({rowData}) => {
            let content = this.store.selectSnapshot(DocumentsState.documentContent);
            if (get(content, 'objectId') !== get(rowData, 'objectId')) {
              this.downloadFileBeforeViewContent(rowData, content);
            } else {
              this.objectUtilsService.downloadFile(get(content, 'blob'), get(rowData, 'title'))
            }
          },
          disabled: ({rowData}) => {
            return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.view) ||
              this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
              this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fillInFolder) ||
              this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
          },
        } as GridIconModel
      },
      {
        width: '5%',
        cellTemplate: 'edit',
        templateOptions: {
          icon: 'edit',
          matTooltip: 'Edit',
          handle: ({rowData}) => {
            this.folderStructureUtilsService.openFolderOrDocumentPropertiesDialog(this.subscriptions, rowData, false, true)
          },
          disabled: ({rowData}) => {
            return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
              this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
          },
        } as GridIconModel
      },
      {
        width: '5%',
        cellTemplate: 'trash',
        templateOptions: {
          icon: 'trash',
          matTooltip: 'Delete',
          handle: ({rowData}) => {
            this.matDialog.open(DeleteDocumentDialogComponent, {
              panelClass: [
                "h-[40vh]", "w-[50vw]"
              ],
              enterAnimationDuration: '0.4s',
              exitAnimationDuration: '200ms',
              data: rowData
            })
          },
          disabled: ({rowData}) => {
            return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl) ||
              this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.delete)
            )
          },
        } as GridIconModel
      },
      {
        width: '5%',
        cellTemplate: 'mat-menu',
        templateOptions: {
          svgIcon: 'options',
          matTooltip: 'Options',
          options: [
            {
              label: 'folderStructure.viewContent',
              icon: 'view-content',
              onClick: rowData => {
                this.subscriptions.add(
                  this.store.dispatch(new SetSelectedDocument(rowData)).subscribe({
                    complete: () => {
                      this.store.dispatch(new GetDocumentContentById(get(rowData, 'objectId')))
                    }
                  })
                )
                this.store.dispatch(new SetViewContent(true));
              },
              disabled: rowData => {
                return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.view) ||
                  this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                  this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
              },
            },
            {
              label: 'folderStructure.editProperty',
              icon: 'edit',
              isMatMenu: true,
              disabled: rowData => {
                return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                  this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
              },
              options: [
                {
                  label: 'folderStructure.properties',
                  icon: 'inherited-properties',
                  iconClass: 'icon-size-5',
                  onClick: rowData => {
                    this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, rowData, false);
                  },
                  disabled: rowData => {
                    return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                      this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
                  },
                },
                {
                  label: 'folderStructure.versions',
                  icon: 'versions',
                  onClick: rowData => {
                    this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, rowData, false, DocumentPropertiesStepsEnum.Versions);
                  },
                  disabled: rowData => {
                    return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                      this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
                  },
                },
                {
                  label: 'folderStructure.security',
                  icon: 'security',
                  onClick: rowData => {
                    this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, rowData, false, DocumentPropertiesStepsEnum.Security);
                  },
                  disabled: rowData => {
                    return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
                  },
                },
                {
                  label: 'folderStructure.foldersFieldIn',
                  icon: 'folders-field-in',
                  onClick: rowData => {
                    this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, rowData, false, DocumentPropertiesStepsEnum.FoldersFieldIn);
                  },
                  disabled: rowData => {
                    return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fillInFolder) ||
                      this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
                  },
                },
                // {
                //   label: 'folderStructure.linkedDocuments',
                //   icon: 'linked-documents',
                //   onClick: rowData => {
                //     const utils = inject(FolderStructureUtilsService);
                //     utils.getAllAPIsForEditProperties(this.subscriptions, rowData, false, DocumentPropertiesStepsEnum.LinkedDocuments);
                //   }
                // }
              ]
            },
            {
              label: 'folderStructure.download',
              icon: 'organizo-outline-icons:download',
              isMatMenu: true,
              disabled: rowData => {
                return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.view) ||
                  this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                  this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl)
                )
              },
              options: [
                {
                  label: 'folderStructure.asPDF',
                  icon: 'document',
                  onClick: rowData => {
                    const content = this.store.selectSnapshot(DocumentsState.documentContent);
                    this.objectUtilsService.downloadFile(get(content, 'blob'), get(rowData, 'title'))
                  },
                  disabled: rowData => {
                    return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.view) ||
                      this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                      this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
                  },
                },
                {
                  label: 'folderStructure.asOrigin',
                  icon: 'document',
                  onClick: (rowData) => {
                    let content = this.store.selectSnapshot(DocumentsState.documentContent);
                    if (get(content, 'objectId') !== get(rowData, 'objectId')) {
                      this.downloadFileBeforeViewContent(rowData, content);
                    } else {
                      this.objectUtilsService.downloadFile(get(content, 'blob'), get(rowData, 'title'))
                    }
                  },
                  disabled: rowData => {
                    return !(this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.view) ||
                      this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                      this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl))
                  },
                }
              ]
            },
            {
              label: 'folderStructure.checkOut',
              icon: 'check-out',
              disabled: rowData => {
                return !(
                  (
                    this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                    this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl)
                  ) && !get(rowData, 'lock')
                )
              },
              onClick: (rowData) => {
                this.store.dispatch(new DocumentCheckOutAction(get(rowData, 'versionSeriesId'), this.activatedRoute.snapshot.queryParams['containerId']));
              }
            },
            {
              label: 'folderStructure.cancelCheckOut',
              icon: 'organizo-outline-icons:document-minus',
              onClick: (rowData) => {
                this.store.dispatch(new DocumentCancelCheckOutAction(get(rowData, 'versionSeriesId'), this.activatedRoute.snapshot.queryParams['containerId']));
              },
              disabled: rowData => {
                const utils = inject(ObjectUtilsService);
                return !(
                  (
                    utils.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                    utils.hasPermission(get(rowData, 'features'), Permissions.document.fullControl)
                  ) && get(rowData, 'lock')
                )
              },
            },
            {
              label: 'folderStructure.checkInAsMajor',
              disabled: rowData => {
                return !(
                  (
                    this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                    this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl)
                  ) && get(rowData, 'lock')
                )
              },
              icon: 'organizo-outline-icons:clipboard-document-check',
              onClick: (rowData) => {
                this.folderStructureUtilsService.openCheckInDialog(this.subscriptions, rowData, true)
              }
            },
            {
              label: 'folderStructure.checkInAsMinor',
              disabled: rowData => {
                return !(
                  (
                    this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.edit) ||
                    this.objectUtilsService.hasPermission(get(rowData, 'features'), Permissions.document.fullControl)
                  ) && get(rowData, 'lock')
                )
              },
              icon: 'organizo-outline-icons:document-duplicate',
              onClick: (rowData) => {
                this.folderStructureUtilsService.openCheckInDialog(this.subscriptions, rowData, false)
              }
            },
            {
              label: 'folderStructure.lunchWorkflow',
              icon: 'workflow',
              onClick:  async ({rowData}) => {
                await lastValueFrom(this.store.dispatch(new GetUsersAndSecretary()));
                inject(MatDialog).open(LunchWorkflowDialogComponent,{
                  panelClass: [
                    "h-[90vh]", "w-[50vw]", "max-sm:w-full", "max-sm:h-[70vh]", "max-[1200px]:w-[50vw]",
                  ],
                  data: this.store.selectSnapshot(InboxState.users)
                })
              }
            },

          ]
        } as GridMatMenuModel
      },

    ],
    onRowDblClick: event => {
      const rowData = get(event, 'data');
      this.subscriptions.add(
        this.store.dispatch(new SetSelectedDocument(rowData)).subscribe({
          complete: () => {
            this.store.dispatch(new GetDocumentContentById(get(rowData, 'objectId')))
          }
        })
      )
      this.store.dispatch(new SetViewContent(true));
    },
    excelFileName: 'Document',
    customizeWorkbookForExcel: () => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Document');
      worksheet.columns = [{ width: 40 },{ width: 40 },{ width: 40 },{ width: 40 }];
      return {
        workbook: workbook,
        worksheet: worksheet
      }
    },
    customizeCellForExport: ({gridCell, excelCell}) => {
      excelCell.alignment = {horizontal: 'center'};


      if (gridCell.rowType === 'header' && !gridCell.column.hasOwnProperty('cellTemplate')) {
        excelCell.font = {name: 'Arial', size: 16};
        excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
      }

      if (gridCell.rowType === 'header' && gridCell.column.hasOwnProperty('cellTemplate')) {

        excelCell.font = {name: 'Arial', size: 12};
        excelCell.value = '';

        switch (gridCell.column.cellTemplate){

          case 'document':
            excelCell.font = {name: 'Arial', size: 16};
            excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
            excelCell.value = 'Document'
            break;

          case "creationDate":
            excelCell.font = {name: 'Arial', size: 16};
            excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
            excelCell.value = 'Creation Date'
            break;

          case "modifiedDate":
            excelCell.font = {name: 'Arial', size: 16};
            excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
            excelCell.value = 'Modified Date'
            break;

          default:
            break;
        }
      }

      if(gridCell.rowType === 'data'&& gridCell.column.cellTemplate === 'lock'){
        if (gridCell.value == true)
          excelCell.value = 'Locked'
        else
          excelCell.value = 'UnLocked'
      }
    }
  };

  constructor(subscription: Subscription, drawer?: OrganizoDrawerComponent) {
    this.subscriptions = subscription;
    if (drawer) {
      const store = inject(Store);
      this.subscriptions.add(
        store.select(DocumentsState.viewContent).subscribe(data => {
          if (data) {
            this.hideMatIcons()
            drawer.close();
          } else {
            this.viewMatIcons();
            drawer.open();
          }
        })
      )
    }
  }

  hideMatIcons() {
    this.gridConfig.columnsDef[0].templateOptions.hidden = true;
    this.gridConfig.columnsDef[4].templateOptions.hidden = true;
    this.gridConfig.columnsDef[5].templateOptions.hidden = true;
    this.gridConfig.columnsDef[6].templateOptions.hidden = true;
    this.gridConfig.columnsDef[0].width = '0%';
    this.gridConfig.columnsDef[1].width = '30%';
    this.gridConfig.columnsDef[4].width = '0%';
    this.gridConfig.columnsDef[5].width = '0%';
    this.gridConfig.columnsDef[6].width = '0%';
    this.gridConfig.columnsDef[7].width = '20%';
  }

  viewMatIcons() {
    this.gridConfig.columnsDef[0].templateOptions.hidden = false;
    this.gridConfig.columnsDef[4].templateOptions.hidden = false;
    this.gridConfig.columnsDef[5].templateOptions.hidden = false;
    this.gridConfig.columnsDef[6].templateOptions.hidden = false;
    this.gridConfig.columnsDef[0].width = '5%';
    this.gridConfig.columnsDef[4].width = '5%';
    this.gridConfig.columnsDef[5].width = '5%';
    this.gridConfig.columnsDef[6].width = '5%';
    this.gridConfig.columnsDef[7].width = '5%';
  }

  downloadFileBeforeViewContent(rowData: any, content: any) {
    const objectUtilsService = inject(ObjectUtilsService);
    const store = inject(Store);
    if (!content) {
      store.dispatch(new SetViewContent(false));
    }
    this.subscriptions.add(
      store.dispatch(new SetSelectedDocument(rowData, true)).subscribe({
        complete: () => {
          this.subscriptions.add(
            store.dispatch(new GetDocumentContentById(get(rowData, 'objectId'), true)).subscribe(
              {
                complete: () => {
                  const value = store.selectSnapshot(DocumentsState.contentForDownload)
                  objectUtilsService.downloadFile(get(value, 'blob'), get(rowData, 'title'));
                }
              }
            )
          )
        }
      })
    )
  }

}

