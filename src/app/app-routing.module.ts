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
            path: 'groups',
            loadChildren: () => import('@app/pages/groups/groups.module').then(m => m.GroupsModule),
            title: 'Groups'
          },
          {
            path: 'folders',
            loadChildren: () => import('@app/pages/folders/folders.module').then(m => m.FoldersModule),
            title: 'Folders'
          },
          {
            path: 'users',
            loadChildren: () => import('@app/pages/users/users.module').then(m => m.UsersModule),
            title: 'Users'
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
