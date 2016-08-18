import { RouterConfig } from '@angular/router';

import { LanguagesCenterComponent } from './languages-center.component';
import { LanguagesListComponent } from './languages-list.component';
import { LanguagesNewComponent } from './languages-new.component';
import { LanguagesEditComponent } from './languages-edit.component';

import { Auth } from '../auth';
import { AuthAdmin } from '../auth-admin';

export const LanguagesRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/languages',
    pathMatch: 'full'
  },
  {
    path: 'languages',
    component: LanguagesCenterComponent,
    children: [
      {
        path: '',
        component: LanguagesListComponent,
      },
      {
        path: 'new',
        component: LanguagesNewComponent,
        canActivate: [Auth]
      },
      {
        path: ':extension',
        component: LanguagesEditComponent,
        canActivate: [AuthAdmin]
      }
    ]
  }
];