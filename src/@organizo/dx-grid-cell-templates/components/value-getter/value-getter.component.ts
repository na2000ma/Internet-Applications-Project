import {Component} from '@angular/core';
import {CellTemplateComponent} from "@organizo/dx-grid/components/cell-template/cell-template.component";
import {NgStyle} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

export interface GridValueGetterModel {
  valueGetter: (cellData: any, rowData: any) => any,
  class?: string
}

@Component({
  selector: 'organizo-value-getter',
  standalone: true,
  imports: [
    NgStyle,
    MatTooltip
  ],
  templateUrl: './value-getter.component.html',
  styleUrl: './value-getter.component.scss'
})
export class ValueGetterComponent extends CellTemplateComponent {

  constructor() {
    super();
  }
}
