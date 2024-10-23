import {BaseGrid} from "@organizo/dx-grid/models/base-grid";
import {Observable} from "rxjs";
import {BaseGridConfiguration} from "@organizo/dx-grid/models/base-grid-config";
import {CellType, CellTypeName} from "@organizo/dx-grid-cell-templates/enums/cell.types";
import {GridValueGetterModel} from "@organizo/dx-grid-cell-templates/components/value-getter/value-getter.component";
import moment from "moment";
import {LifeCycleStatusValues} from "@app/pages/folder-structure/dummy-data/life-cycle-status-values";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {get} from "lodash-es";
import {Workbook} from "exceljs";

export class DocumentVersionsGrid implements BaseGrid {
  dataSource$: Observable<any> = inject(Store).select(DocumentsState.documentVersions);
  gridConfig: BaseGridConfiguration = {
    showColumnHeaders: true,
    allowColumnResizing: false,
    columnAutoWidth: false,
    enableColumnChooser: false,
    // enableColumnFixed must be false
    enableColumnFixed: false,
    enableColumnsGrouping: false,
    enableGridFilter: false,
    enableSearchPanel: false,
    showColumnLines: false,
    showBorders: false,
    showRowLines: false,
    rowAlternationEnabled: false,
    enableDetails: false,
    enableExport: true,
    hoverStateEnabled: true,
    templateDef: {
      date: CellType[CellTypeName.ValueGetter],
      versionNumber: CellType[CellTypeName.ValueGetter],
      status: CellType[CellTypeName.ValueGetter]
    },

    columnsDef: [
      {
        caption: 'folderStructure.title',
        dataField: 'title'
      },
      {
        caption: 'folderStructure.versionNu',
        dataField: 'versionSeriesId',
        cellTemplate: 'versionNumber',
        templateOptions: {
          valueGetter: (cellData, rowData) => get(rowData, 'majorVersionNumber') + '.' + get(rowData, 'minorVersionNumber')
        } as GridValueGetterModel
      },
      {
        caption: 'folderStructure.date',
        dataField: 'creationDate',
        cellTemplate: 'date',
        templateOptions: {
          valueGetter: cellData => cellData ? moment(cellData).format('YYYY-MM-DD hh:mm A') : null
        } as GridValueGetterModel
      },
      {
        caption: 'folderStructure.status',
        dataField: 'lifecycleStatus',
        cellTemplate: 'status',
        templateOptions: {
          valueGetter: cellData => get(LifeCycleStatusValues.find(value => get(value, 'id') === +cellData), 'value'),
        } as GridValueGetterModel
      }
    ],
    excelFileName: 'Document_Version',
    customizeWorkbookForExcel: () => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Document_Version');
      worksheet.columns = [{ width: 40 },{ width: 40 },{ width: 40 },{ width: 40 },];
      return {
        workbook: workbook,
        worksheet: worksheet
      }
    },
    customizeCellForExport: ({gridCell, excelCell}) => {
      excelCell.alignment = {horizontal: 'center'};


      if (gridCell.rowType === 'header') {
        excelCell.font = {name: 'Arial', size: 16};
        excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
      }

    }

  }
}
