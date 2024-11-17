import {BaseGridConfiguration} from "@organizo/dx-grid/models/base-grid-config";
import {BaseGrid} from "@organizo/dx-grid/models/base-grid";
import {Observable} from "rxjs";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {Workbook} from "exceljs";
import {GroupsState} from "@app/pages/groups/store/groups.state";
import {CellType, CellTypeName} from "@organizo/dx-grid-cell-templates/enums/cell.types";
import {GridIconModel} from "@organizo/dx-grid-cell-templates/components/grid-icon/grid-icon.component";
import {AddGroupDialogComponent} from "@app/pages/groups/components/add-group-dialog/add-group-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {GetAllUsersAction, JoinGroupAction, ShowGroupAction} from "@app/pages/groups/store/groups.actions";
import {get} from "lodash-es";
import {GridMatButtonModel} from "@organizo/dx-grid-cell-templates/components/mat-button/mat-button.component";
import {ActivatedRoute, Router} from "@angular/router";

export class GroupsGrid implements BaseGrid {
  store = inject(Store);

  matDialog = inject(MatDialog);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  dataSource$: Observable<any[]> | any[] = this.store.select(GroupsState.groups);
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
    enableExport: true,
    hoverStateEnabled: false,
    templateDef: {
      'join': CellType[CellTypeName.MatButton],
      'files': CellType[CellTypeName.MatButton],
      'edit': CellType[CellTypeName.MatIcon],
      'trash': CellType[CellTypeName.MatIcon]
    },
    columnsDef: [
      {
        caption: 'Name',
        dataField: 'name'

      },
      {
        caption: 'Owner Name',
        dataField: 'owner_name'
      },
      {
        cellTemplate: 'edit',
        templateOptions: {
          icon: 'edit',
          matTooltip: 'Edit',
          handle: ({rowData}) => {
            this.store.dispatch(new ShowGroupAction(get(rowData, 'id'))).subscribe(
              {
                complete: () => {
                  this.store.dispatch(new GetAllUsersAction()).subscribe({
                    complete: () => {
                      this.matDialog.open(AddGroupDialogComponent, {
                        panelClass: [
                          "h-[40vh]", "w-[50vw]"
                        ],
                        enterAnimationDuration: '0.4s',
                        exitAnimationDuration: '200ms',
                        data: this.store.select(GroupsState.selectedGroup)
                      })
                    }
                  })
                }
              }
            )
          },
        } as GridIconModel
      },
      {
        cellTemplate: 'trash',
        templateOptions: {
          icon: 'trash',
          matTooltip: 'Trash',
          handle: ({rowData}) => {
          },
        } as GridIconModel,
      },
      {
        cellTemplate: 'join',
        templateOptions: {
          label: 'groups.join',
          onClick: (rowData) => {
            this.store.dispatch(new JoinGroupAction(get(rowData, 'id')))
          }
        } as GridMatButtonModel
      },
      {
        cellTemplate: 'files',
        templateOptions: {
          label: 'folders.files',
          onClick: (rowData) => {
            this.router.navigate(['folders'], {
              relativeTo: this.activatedRoute,
              queryParams: {
                groupId: get(rowData, 'id')
              },
              queryParamsHandling: "merge"
            })
          },
          disabled: rowData => {
            return !get(rowData, 'users', []).includes(get(JSON.parse(localStorage.getItem('authUser')), 'id'))
          }
        } as GridMatButtonModel
      }

    ],
    excelFileName: 'Groups',
    customizeWorkbookForExcel: () => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Groups');
      worksheet.columns = [{width: 50}, {width: 50}];
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
      }
      if (gridCell.rowType === 'header' && gridCell.column.caption === 'Folder Name') {
        excelCell.font = {name: 'Arial', size: 16};
        excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
        excelCell.value = 'Folder Name';
      }

    }

  }
}
