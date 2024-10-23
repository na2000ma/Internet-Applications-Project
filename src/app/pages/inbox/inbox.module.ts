import {CommonModule} from '@angular/common';
import { NgModule } from "@angular/core";
import {InboxRoutingModule} from './inbox-routing.module';
import {NgxsModule} from "@ngxs/store";
import {InboxState} from "@app/pages/inbox/store/inbox.state";
import {MainPageComponent} from "@app/pages/inbox/components/main-page/main-page.component";
import {InboxSidebarComponent} from "@app/pages/inbox/components/sidebar/sidebar.component";
import {InboxListComponent} from "@app/pages/inbox/components/list/list.component";
import {
  DispatchTaskDialogComponent
} from "@app/pages/inbox/components/dialogs/dispatch-task-dialog/dispatch-task-dialog.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {OrganizoVerticalNavigationComponent} from "@organizo/components/navigation/vertical/vertical.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {AppFormsModule} from "@organizo/forms/app-forms.module";
import {InboxDetailsComponent} from "@app/pages/inbox/components/details/details.component";
@NgModule({
  declarations: [
    MainPageComponent,
    InboxSidebarComponent,
    InboxListComponent,
    DispatchTaskDialogComponent
  ],
  imports: [
    CommonModule,
    InboxRoutingModule,
    NgxsModule.forRoot([
      InboxState
    ]),
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    OrganizoVerticalNavigationComponent,
    MatProgressBar,
    TranslateModule,
    FormsModule,
    AppFormsModule,
    InboxDetailsComponent
  ],
})
export class InboxModule {}
