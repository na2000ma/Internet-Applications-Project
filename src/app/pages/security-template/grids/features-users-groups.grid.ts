import {Observable, of} from "rxjs";
import {get} from "lodash-es";
import {BaseGrid} from "@organizo/dx-grid/models/base-grid";
import {BaseGridConfiguration} from "@organizo/dx-grid/models/base-grid-config";
import {CellType, CellTypeName} from "@organizo/dx-grid-cell-templates/enums/cell.types";
import {
  GridTypeWithIconModel
} from "@organizo/dx-grid-cell-templates/components/type-with-icon/type-with-icon.component";
import {GridIconModel} from "@organizo/dx-grid-cell-templates/components/grid-icon/grid-icon.component";
import {GridValueGetterModel} from "@organizo/dx-grid-cell-templates/components/value-getter/value-getter.component";
import {SetUsersGroupsFeaturesAction} from "@app/pages/security-template/store/class-security.action";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {Workbook} from "exceljs";
import {ShowSuccessToast} from "@app/store/app.action";

export class FeaturesUsersGroupsGrid implements BaseGrid {
  store = inject(Store);

  dataSource$: Observable<any> | any;
  gridConfig: BaseGridConfiguration = {
    showColumnHeaders: true,
    allowColumnResizing: true,
    columnAutoWidth: false,
    enableColumnChooser: false,
    // enableColumnFixed must be false
    enableColumnFixed: false,
    enableColumnsGrouping: false,
    enableGridFilter: false,
    enableSearchPanel: false,
    showColumnLines: true,
    showBorders: false,
    showRowLines: false,
    rowAlternationEnabled: false,
    enableDetails: false,
    hoverStateEnabled: true,
    enableExport: true,
    templateDef: {
      'name': CellType[CellTypeName.TypeWithIcon],
      'features': CellType[CellTypeName.ValueGetter],
      'mat-menu': CellType[CellTypeName.MatMenu],
      'trash': CellType[CellTypeName.MatIcon],
    },
    columnsDef: [
      {
        caption: 'acce.name',
        dataField: 'name',
        width: '20%',
        cellTemplate: 'name',
        templateOptions: {
          type: rowData => get(rowData, 'type'),
          class: 'flex items-center justify-center gap-2'
        } as GridTypeWithIconModel
      },
      {
        caption: 'acce.features',
        dataField: 'features',
        width: '60%',
        cellTemplate: 'features',
        templateOptions: {
          valueGetter: cellData => customizeArray(cellData, 'displayName')
        } as GridValueGetterModel
      },
      {
        cellTemplate: 'trash',
        templateOptions: {
          icon: 'trash',
          handle: ({rowData}) => {
            this.dataSource$.subscribe((data: any[]) => {
              return data.map((item: any, index: number) => {
                if (get(item, 'adObjectId') === get(rowData, 'adObjectId')) {
                  data.splice(index, 1)
                  this.dataSource$ = of(data);
                  this.store.dispatch([
                    new SetUsersGroupsFeaturesAction(data),
                    new ShowSuccessToast('The privilege was deleted successfully')
                  ])
                  return;
                }
              })
            })
          }
        } as GridIconModel
      },

    ],
    excelFileName: 'Users_Features',
    customizeWorkbookForExcel: () => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Users_Features');
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

  constructor() {

  }
}

function customizeArray(array: any, keyName: string) {
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


