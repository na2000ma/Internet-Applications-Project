import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "@app/pages/folders/components/home-page/home-page.component";

const routes: Routes = [
  {
    path: 'home-page',
    component: HomePageComponent
  },
  {
    path: '**',
    redirectTo: 'home-page'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoldersRoutingModule {}
