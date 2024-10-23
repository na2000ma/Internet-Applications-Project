import {Observable} from "rxjs";

export class BaseColumnConfiguration {
  dataField?: string | Observable<string>;
  dataType?: string;
  width?: number | string;
  fixed?: boolean;
  visible?: boolean;
  cellTemplate?: string;
  headerTemplate?: any;
  templateOptions?: any;
  caption?: string;
  allowExporting?: boolean;
}
