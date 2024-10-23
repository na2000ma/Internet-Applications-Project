import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "@organizo/layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'auth',
        children: [
          {
            path: '',
            children: [
              {
                path: 'sign-in',
                loadComponent: () => import('@app/pages/auth/components/sign-in/sign-in.component').then(c => c.AuthSignInComponent),
                title: 'Sign in'
              },
            ]
          },
        ]
      },
      // Auth routes for guests
      {
        path: '',
        children: [
          {
            path: 'folder-structure',
            loadChildren: () => import('@app/pages/folder-structure/folder-structure.module').then(m => m.FolderStructureModule),
            title: 'Folder Structure'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
