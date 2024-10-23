import {Component} from '@angular/core';
import {DocumentVersionsGrid} from "@app/pages/folder-structure/grids/document-versions.grid";
import {GridsModule} from "@organizo/dx-grid/grids.module";

@Component({
  selector: 'organizo-document-versions',
  templateUrl: './document-versions.component.html',
  styleUrl: './document-versions.component.scss',
  imports: [
    GridsModule
  ],
  standalone: true
})
export class DocumentVersionsComponent {

  gridDef: DocumentVersionsGrid = new DocumentVersionsGrid();

}
