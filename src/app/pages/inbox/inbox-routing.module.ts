import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "@app/pages/inbox/components/main-page/main-page.component";
import {InboxListComponent} from "@app/pages/inbox/components/list/list.component";

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    title: 'Main Page',
    children: [
      {
        path:'sidebar',
        component: InboxListComponent,
        title: 'Sidebar',
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxRoutingModule {}
