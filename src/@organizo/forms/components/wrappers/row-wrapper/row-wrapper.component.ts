import {Component} from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';

@Component({
  selector: 'organizo-row-wrapper',
  templateUrl: './row-wrapper.component.html',
  styleUrl: './row-wrapper.component.scss'
})
export class RowWrapperComponent extends FieldWrapper {
  constructor() {
    super();
  }
}
