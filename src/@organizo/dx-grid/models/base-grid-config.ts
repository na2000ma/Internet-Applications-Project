import {BaseColumnConfiguration} from './base-column';
import {Workbook} from "exceljs";

export interface BaseGridConfiguration {
  allowColumnResizing?: boolean;
  /**
   * @type {boolean}
   * @default false
   * to make column width based on the content of the column
   */
  columnAutoWidth?: boolean;

  /**
   * @type {boolean}
   * @default false
   */
  enableColumnChooser?: boolean;

  /**
   * @type {boolean}
   * @default false
   */
  enableColumnFixed?: boolean;

  /**
   * @type {boolean}
   * @default false
   */
  enableGridFilter?: boolean;

  /**
   * @type {boolean}
   * @default false
   */
  enableSearchPanel?: boolean;

  /**
   * @type {boolean}
   * @default false
   */
  enableColumnsGrouping?: boolean;

  /**
   * @type {boolean}
   * @default false
   */
  hoverStateEnabled?: boolean;


  /**
   * @type {boolean}
   * @default false
   */
  enableExport?: boolean;

  /**
   * @type {BaseColumnConfiguration}
   * column definition here
   */
  columnsDef?: BaseColumnConfiguration[];
  /**
   *
   *
   * @type {[key:string]:any}
   * @memberof BaseGridConfiguration
   */
  templateDef?: { [key: string]: any };
  /**
   * @type {boolean}
   */
  enableDetails?: boolean;
  details?: {
    templateRef?: any;
    templateName?: string;
    templateOptions?: any;
  };
  rowAlternationEnabled?: boolean;
  showColumnLines?: boolean;
  showRowLines?: boolean;
  showBorders?: boolean;
  /**
   * @type {boolean}
   * @default true
   */
  showColumnHeaders?: boolean;
  onGridReady?: (instance: any) => void;
  onRowClick?: (event: any) => void;
  onRowDblClick?: (event: any) => void;

  enablePagination?: boolean;

  paginationOptions?: {
    onPageChange: (event: any) => void
  }

  excelFileName?: string;

  customizeWorkbookForExcel?: () => {workbook: Workbook, worksheet: any};

  customizeCellForExport?: ({gridCell, excelCell}) => void


}
