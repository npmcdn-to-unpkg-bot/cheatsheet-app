import { RouterConfig } from '@angular/router';

import { CheatSheetsCenterComponent } from './cheatsheets-center.component';
import { CheatSheetsListComponent } from './cheatsheets-list.component';
import { CheatSheetsNewComponent } from './cheatsheets-new.component';
import { CheatSheetsEditComponent } from './cheatsheets-edit.component';
import { CheatSheetsViewComponent } from './cheatsheets-view.component';

import { Auth } from '../auth';
import { AuthAdmin } from '../auth-admin';

export const CheatSheetsRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/cheatsheets',
    pathMatch: 'full'
  },
  {
    path: 'cheatsheets',
    component: CheatSheetsCenterComponent,
    children: [
      {
        path: '',
        component: CheatSheetsListComponent,
      },
      {
        path: 'new',
        component: CheatSheetsNewComponent,
        canActivate: [Auth]
      },
      {
        path: ':id',
        component: CheatSheetsEditComponent,
        canActivate: [AuthAdmin]
      },
      {
        path: 'view/:id',
        component: CheatSheetsViewComponent
      }
    ]
  }
];