import {Pipe, PipeTransform} from '@angular/core';
import {defaultTo, isFunction} from 'lodash-es';


@Pipe({
  name: 'filter',
  pure: true,
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], cb: ((item: any) => boolean) | (((item: any) => boolean)[])): any {
    if (!cb) {
      return value;
    } else if (isFunction(cb)) {
      return defaultTo(value, []).filter(cb);
    }
    return [];
  }
}
