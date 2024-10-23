import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {isFunction} from 'lodash-es';
import {CellTemplateComponent} from "@organizo/dx-grid/components/cell-template/cell-template.component";
import {MatTooltip} from "@angular/material/tooltip";

export interface GridIconModel {
  label?: string;
  matTooltip?: string;
  icon: string | (({cellData, rowData}: any) => string);
  handle: ({event, cellData, rowData}: any) => void;
  disabled: (({cellData, rowData}?: any) => boolean) | boolean;
  hidden: (({cellData, rowData}?: any) => boolean) | boolean;
}

@Component({
  selector: 'app-grid-icon',
  templateUrl: './grid-icon.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, MatTooltip],
  styleUrls: ['./grid-icon.component.scss']
})
export class GridIconComponent extends CellTemplateComponent implements OnInit {

  protected readonly isFunction = isFunction;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  handle(event) {
    event.preventDefault();
    event.stopPropagation();
    if (isFunction(this.to['handle'])) {
      this.to.handle({event: event, cellData: this.cellData, rowData: this.rowData});
    }
  }

  disabled() {
    return isFunction(this.to.disabled) ? this.to.disabled({
      cellData: this.cellData,
      rowData: this.rowData
    }) : (this.to.disabled || false);
  }

  hidden() {
    return isFunction(this.to.hidden) ? this.to.hidden({
      cellData: this.cellData,
      rowData: this.rowData
    }) : (this.to.hidden || false);
  }
}
