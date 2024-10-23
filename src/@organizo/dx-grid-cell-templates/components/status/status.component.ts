import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {CellTemplateComponent} from "@organizo/dx-grid/components/cell-template/cell-template.component";

@Component({
  selector: 'organizo-status',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent extends CellTemplateComponent {


  constructor() {
    super();
  }

  getClassByStatus(value: any) {
    return 'btn-status btn-' + value;
  }

}
