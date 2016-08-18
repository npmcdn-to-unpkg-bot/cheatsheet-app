
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { LanguagesService } from './languages.service';


@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [LanguagesService]
})
export class LanguagesCenterComponent { }