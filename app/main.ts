import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app.component';
import { disableDeprecatedForms, provideForms } from '@angular/forms'

import { APP_ROUTER_PROVIDERS } from './app.routes';
import { AuthService } from './auth.service';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  APP_ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  AuthService
])
.catch(err => console.error(err));