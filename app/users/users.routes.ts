import { RouterConfig } from '@angular/router';

import { UsersCenterComponent } from './users-center.component';
import { UsersListComponent } from './users-list.component';
import { UsersEditComponent } from './users-edit.component';
import { UsersNewComponent } from './users-new.component';

import { Auth } from '../auth';
import { AuthAdmin } from '../auth-admin';


export const UsersRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UsersCenterComponent,
    children: [
      {
        path: '',
        component: UsersListComponent,
        canActivate: [AuthAdmin]
      },
      {
        path: 'new',
        component: UsersNewComponent,
        canActivate: [AuthAdmin]
      },
      {
        path: ':email',
        component: UsersEditComponent,
        canActivate: [Auth]
      }
    ]
  }
];