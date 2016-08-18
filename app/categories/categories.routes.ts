import { RouterConfig } from '@angular/router';

import { CategoriesCenterComponent } from './categories-center.component';
import { CategoriesListComponent } from './categories-list.component';
import { CategoriesNewComponent } from './categories-new.component';
import { CategoriesEditComponent } from './categories-edit.component';

import { Auth } from '../auth';
import { AuthAdmin } from '../auth-admin';


export const CategoriesRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/categories',
    pathMatch: 'full'
  },
  {
    path: 'categories',
    component: CategoriesCenterComponent,
    children: [
      {
        path: '',
        component: CategoriesListComponent,
      },
      {
        path: 'new',
        component: CategoriesNewComponent,
        canActivate: [Auth]
      },
      {
        path: ':id',
        component: CategoriesEditComponent,
        canActivate: [AuthAdmin]
      }
    ]
  }
];