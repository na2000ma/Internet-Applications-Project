import {Observable} from "rxjs";
import {get} from "lodash-es";
import {BaseGrid} from "@organizo/dx-grid/models/base-grid";
import {BaseGridConfiguration} from "@organizo/dx-grid/models/base-grid-config";
import {CellType, CellTypeName} from "@organizo/dx-grid-cell-templates/enums/cell.types";
import {
  GridTypeWithIconModel
} from "@organizo/dx-grid-cell-templates/components/type-with-icon/type-with-icon.component";
import {GridValueGetterModel} from "@organizo/dx-grid-cell-templates/components/value-getter/value-getter.component";
import {Workbook} from "exceljs";


export class SecurityTemplateClassGrid implements BaseGrid {
  dataSource$: Observable<any> | any;
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
    hoverStateEnabled: true,
    enableExport: true,
    templateDef: {
      'name': CellType[CellTypeName.TypeWithIcon],
      'features': CellType[CellTypeName.ValueGetter]
    },
    columnsDef: [
      {
        caption: 'acce.name',
        dataField: 'name',
        width: '20%',
        cellTemplate: 'name',
        templateOptions: {
          type: rowData => get(rowData, 'adObjectType'),
          class: 'flex items-center justify-center gap-1'
        } as GridTypeWithIconModel
      },
      {
        caption: 'acce.privilege',
        dataField: 'features',
        width: '60%',
        cellTemplate: 'features',
        templateOptions: {
          valueGetter: cellData => customizeArray(cellData, 'displayName')
        } as GridValueGetterModel
      }
    ],
    excelFileName: 'Security_Template',
    customizeWorkbookForExcel: () => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Security_Template');
      worksheet.columns = [{ width: 30 },{ width: 30 },{ width: 30 },];
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
          case "name":
            excelCell.font = {name: 'Arial', size: 16};
            excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
            excelCell.value = 'Name'
            break;

          case "features":
            excelCell.font = {name: 'Arial', size: 16};
            excelCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ff2a3e51'}};
            excelCell.value = 'Privilege'
            break;

          default:
            break;
        }
      }
    }
  };

  constructor(dataSource$?: Observable<any> | any) {
    this.dataSource$ = dataSource$;
  }

}


export function customizeArray(array: any, keyName: string) {
  let value = ''
  array.forEach((item: any, index: number) => {
    if (index !== array.length - 1) {
      value += get(item, keyName) + ', '
    } else {
      value += get(item, keyName)
    }
  })
  return value;
}


