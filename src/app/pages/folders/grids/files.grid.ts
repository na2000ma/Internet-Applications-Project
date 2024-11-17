import {BaseGrid} from "@organizo/dx-grid/models/base-grid";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {GroupsState} from "@app/pages/groups/store/groups.state";
import {BaseGridConfiguration} from "@organizo/dx-grid/models/base-grid-config";
import {CellType, CellTypeName} from "@organizo/dx-grid-cell-templates/enums/cell.types";
import {GetAllUsersAction, JoinGroupAction, ShowGroupAction} from "@app/pages/groups/store/groups.actions";
import {get} from "lodash-es";
import {AddGroupDialogComponent} from "@app/pages/groups/components/add-group-dialog/add-group-dialog.component";
import {GridIconModel} from "@organizo/dx-grid-cell-templates/components/grid-icon/grid-icon.component";
import {GridMatButtonModel} from "@organizo/dx-grid-cell-templates/components/mat-button/mat-button.component";
import {FoldersState} from "@app/pages/folders/store/folders.state";

export class FilesGrid implements BaseGrid {
  store = inject(Store);

  matDialog = inject(MatDialog);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  dataSource$: Observable<any[]> | any[] = this.store.select(FoldersState.acceptedFiles);
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
      'folders': CellType[CellTypeName.MatButton],
      'edit': CellType[CellTypeName.MatIcon],
      'trash': CellType[CellTypeName.MatIcon]
    },
    columnsDef: [
      {
        caption: 'Name',
        dataField: 'name'

      },
      {
        caption: 'Status',
        dataField: 'status'
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
      }

    ],
  }
}
