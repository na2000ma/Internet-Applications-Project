import {CommonModule} from '@angular/common';
import { NgModule } from "@angular/core";
import {UsersRoutingModule} from './users-routing.module';
import {NgxsModule} from "@ngxs/store";
import {UsersState} from "@app/pages/users/store/users.state";
import { HomePageComponent } from './components/home-page/home-page.component';
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {MatButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgxsModule.forRoot([
      UsersState
    ]),
    GridsModule,
    MatButton,
    MatCheckbox,
    MatIcon,
    TranslateModule
  ],
})
export class UsersModule {}
