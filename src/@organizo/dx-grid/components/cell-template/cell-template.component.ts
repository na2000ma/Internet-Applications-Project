import {Component} from '@angular/core';

@Component({
  selector: 'app-cell-template',
  templateUrl: './cell-template.component.html',
  styleUrls: ['./cell-template.component.scss']
})
export class CellTemplateComponent {
  rowData: any;
  cellData: any;
  to: any;
  caption: any;

  constructor() {
  }
}
