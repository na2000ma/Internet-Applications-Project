import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchTemplateRoutingModule} from './search-template-routing.module';
import {HomePageComponent} from './components/home-page/home-page.component';
import {FormlyModule} from "@ngx-formly/core";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {AppFormsModule} from "@organizo/forms/app-forms.module";
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {NgxsModule} from "@ngxs/store";
import {SearchTemplateState} from "@app/pages/search-template/store/search-template.state";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";


@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    SearchTemplateRoutingModule,
    NgxsModule.forRoot([
      SearchTemplateState,
      FoldersState,
      DocumentsState
    ]),
    FormlyModule,
    FormsModule,
    MatButton,
    MatIcon,
    TranslateModule,
    AppFormsModule,
    GridsModule,
    MatExpansionPanel,
    MatExpansionPanelHeader
  ]
})
export class SearchTemplateModule {
}
