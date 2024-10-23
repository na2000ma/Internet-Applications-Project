import {Observable} from "rxjs";
import {BaseGridConfiguration} from "./base-grid-config"

export abstract class BaseGrid {
  dataSource$: any[] | Observable<any[]>;
  gridConfig: BaseGridConfiguration
}
