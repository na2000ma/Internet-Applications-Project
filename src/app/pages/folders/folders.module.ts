import {CommonModule} from '@angular/common';
import { NgModule } from "@angular/core";
import {FoldersRoutingModule} from './folders-routing.module';
import {NgxsModule} from "@ngxs/store";
import { HomePageComponent } from './components/home-page/home-page.component';
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {MatButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import { AddFolderDialogComponent } from './components/add-folder-dialog/add-folder-dialog.component';
import {FormlyModule} from "@ngx-formly/core";
import {ReactiveFormsModule} from "@angular/forms";
import {FoldersState} from "@app/pages/folders/store/folders.state";
@NgModule({
  declarations: [
    HomePageComponent,
    AddFolderDialogComponent
  ],
  imports: [
    CommonModule,
    FoldersRoutingModule,
    NgxsModule.forRoot([
      FoldersState
    ]),
    GridsModule,
    MatButton,
    MatCheckbox,
    MatIcon,
    TranslateModule,
    FormlyModule,
    ReactiveFormsModule
  ],
})
export class FoldersModule {}
