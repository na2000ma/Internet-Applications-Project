import {Pipe, PipeTransform} from '@angular/core';
import {environment} from "@env/environment";

@Pipe({
  name: 'prefixSuffixImage',
  standalone: true
})
export class PrefixSuffixImagePipe implements PipeTransform {

  transform(value: string, type: string): string {
    if (value) {
      return environment.serverURL.slice(0, environment.serverURL.length - 1) + value;
    } else {
      if (type == 'folder') {
        return `${environment.base}assets/icons/folder-bg.svg`;
      } else if (type == 'group') {
        return `${environment.base}assets/icons/groupIcon.svg`;
      } else {
        return `${environment.base}assets/icons/userIcon.svg`;
      }
    }
  }

}
