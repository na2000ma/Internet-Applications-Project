import {Component} from '@angular/core';
import {CellTemplateComponent} from "@organizo/dx-grid/components/cell-template/cell-template.component";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

export interface GridMatButtonModel {
  label?: string;
  class?: string;
  onClick: (rowData: any) => void;
}

@Component({
  selector: 'organizo-mat-button',
  standalone: true,
  imports: [
    MatButton,
    TranslateModule
  ],
  templateUrl: './mat-button.component.html',
  styleUrl: './mat-button.component.scss'
})
export class MatButtonComponent extends CellTemplateComponent {

  constructor() {
    super();
  }

  handleClick(event: any) {

    event.preventDefault();
    event.stopPropagation();

    if (this.to?.onClick) {
      this.to?.onClick(this.rowData)
    }

  }
}
