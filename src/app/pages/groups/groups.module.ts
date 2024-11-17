import {CommonModule} from '@angular/common';
import { NgModule } from "@angular/core";
import {GroupsRoutingModule} from './groups-routing.module';
import {NgxsModule} from "@ngxs/store";
import {GroupsState} from "@app/pages/groups/store/groups.state";
import { HomePageComponent } from './components/home-page/home-page.component';
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import { AddGroupDialogComponent } from './components/add-group-dialog/add-group-dialog.component';
import {AppFormsModule} from "@organizo/forms/app-forms.module";
import {FormlyModule} from "@ngx-formly/core";
import {MatCheckbox} from "@angular/material/checkbox";
@NgModule({
  declarations: [
    HomePageComponent,
    AddGroupDialogComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    NgxsModule.forRoot([
      GroupsState
    ]),
    GridsModule,
    MatButton,
    MatIcon,
    TranslateModule,
    AppFormsModule,
    FormlyModule,
    MatCheckbox
  ],
})
export class GroupsModule {}
