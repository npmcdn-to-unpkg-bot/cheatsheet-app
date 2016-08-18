import { RouterConfig } from '@angular/router';

import { DatabaseComponent } from './database.component';
import { AuthAdmin } from '../auth-admin';


export const DatabaseRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/database',
    pathMatch: 'full'
  },
  {
    path: 'database',
    component: DatabaseComponent,
    canActivate: [AuthAdmin]
  }
];