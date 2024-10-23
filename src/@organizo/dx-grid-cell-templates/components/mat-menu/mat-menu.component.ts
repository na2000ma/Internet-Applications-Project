import {Component, Input} from '@angular/core';
import {CellTemplateComponent} from "@organizo/dx-grid/components/cell-template/cell-template.component";
import {isFunction} from "lodash-es";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";
import {NgClass} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";


export interface GridMatMenuModel {
  svgIcon: string;
  label?: string;
  matTooltip?: string;
  disabled?: boolean | ((rowData: any) => boolean);
  hidden?: boolean | ((rowData: any) => boolean);
  options: Array<OptionModel> | Array<GridMatMenuModel>;
}

declare interface OptionModel {
  label: string;
  icon: string;
  onClick: (rowData: any) => void;
  disabled?: boolean | ((rowData: any) => boolean);
  hidden?: boolean | ((rowData: any) => boolean);
  isMatMenu?: boolean;
  options?: Array<OptionModel>;
}

@Component({
  selector: 'organizo-mat-menu',
  standalone: true,
  imports: [
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    TranslateModule,
    MatMenuItem,
    NgClass,
    MatTooltip
  ],
  templateUrl: './mat-menu.component.html',
  styleUrl: './mat-menu.component.scss'
})
export class MatMenuComponent extends CellTemplateComponent {


  public readonly isFunction = isFunction;

  constructor() {
    super();
  }

  @Input('config') set _config(value: GridMatMenuModel) {
    if (value) {
      this.to = value
    }
  }

  @Input('rowData') set _rowData(value: any) {
    if (value) {
      this.rowData = value
    }
  }

  handleClick(i: number) {
    if (this.to.options[i]) {
      this.to.options[i].onClick(this.rowData);
    }
  }

  handleMatIconClick(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
}
