import {Component} from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';

@Component({
  selector: 'organizo-column-wrapper',
  templateUrl: './column-wrapper.component.html',
  styleUrl: './column-wrapper.component.scss'
})
export class ColumnWrapperComponent extends FieldWrapper {
  constructor() {
    super();
  }
}
