import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home.component';
import { CategoriesRoutes } from './categories/categories.routes';
import { LanguagesRoutes } from './languages/languages.routes';
import { UsersRoutes } from './users/users.routes';
import { CheatSheetsRoutes } from './cheatsheets/cheatsheets.routes';
import { DatabaseRoutes } from './database/database.routes';
import { AUTH_PROVIDERS } from './auth.providers';

export const routes: RouterConfig = [
  {
    path: '',
    component: HomeComponent,
  },
  ... CategoriesRoutes,
  ... LanguagesRoutes,
  ... UsersRoutes,
  ... CheatSheetsRoutes,
  ... DatabaseRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  AUTH_PROVIDERS
];