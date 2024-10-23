import {Pipe, PipeTransform} from '@angular/core';
import {chain, includes, isFunction} from 'lodash-es';

@Pipe({
  name: 'listFilter',
  pure: true,
  standalone: true
})
export class ListFilterPipe implements PipeTransform {
  transform(data: any[], currentValues: any[], filterValue: any, valueExpr: string, displayExpr: any): any {
    return (chain(data) as any).differenceBy(currentValues || [], (i: any) => i[valueExpr])
      .filter((i: any) => includes(isFunction(displayExpr) ? displayExpr(i) : i[displayExpr], filterValue))
      .value() || [];
  }
}
