import {BaseGrid} from "@organizo/dx-grid/models/base-grid";
import {BaseGridConfiguration} from "@organizo/dx-grid/models/base-grid-config";
import {Observable} from "rxjs";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {CellType, CellTypeName} from "@organizo/dx-grid-cell-templates/enums/cell.types";
import {GridIconModel} from "@organizo/dx-grid-cell-templates/components/grid-icon/grid-icon.component";
import {
  GridTypeWithIconModel
} from "@organizo/dx-grid-cell-templates/components/type-with-icon/type-with-icon.component";
import {SetDeletedItemFromGridFolderFieldIn} from "@app/pages/folder-structure/store/documents/documents.actions";
import {Workbook} from "exceljs";

export class DocumentFoldersFieldInGrid implements BaseGrid {
  dataSource$: Observable<any[]> | any[] = inject(Store).select(DocumentsState.folderFieldIn);
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
      'folder': CellType[CellTypeName.TypeWithIcon],
      'trash': CellType[CellTypeName.MatIcon],
    },

    columnsDef: [
      {
        caption: 'Folder Name',
        dataField: 'containerPath',
        cellTemplate: 'folder',
        templateOptions: {
          type: 'folder',
          class: 'flex items-center justify-center h-full gap-2'
        } as GridTypeWithIconModel

      },
      {
        cellTemplate: 'trash',
        templateOptions: {
          icon: 'trash',
          handle: ({rowData}) => {
            const store = inject(Store);
            store.dispatch(new SetDeletedItemFromGridFolderFieldIn(rowData));
          }
        } as GridIconModel
      }
    ],
    excelFileName: 'Document-Folder_Field-in',
    customizeWorkbookForExcel: () => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Document-Folder_Field-in');
      worksheet.columns = [{ width: 50 }];
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
      if(gridCell.rowType === 'header' && gridCell.column.caption === 'Folder Name'){
        excelCell.font = {name: 'Arial', size: 16};
        excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
        excelCell.value = 'Folder Name';
      }

    }

  }
}
