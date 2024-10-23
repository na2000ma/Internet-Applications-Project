import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GridWrapperComponent} from './components/grid-wrapper/grid-wrapper.component';
import {DxDataGridModule} from 'devextreme-angular';
import {CellTemplateWrapperComponent} from './components/cell-template-wrapper/cell-template-wrapper.component';
import {CellTemplateComponent} from './components/cell-template/cell-template.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatPaginator} from "@angular/material/paginator";


@NgModule({
  declarations: [
    GridWrapperComponent,
    CellTemplateWrapperComponent,
    CellTemplateComponent,
  ],
  imports: [
    CommonModule,
    DxDataGridModule,
    TranslateModule,
    MatPaginator
  ],
  exports: [
    GridWrapperComponent,
    CellTemplateComponent
  ]
})
export class GridsModule {
}
