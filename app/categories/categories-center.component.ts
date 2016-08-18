
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { CategoriesService } from './categories.service';




@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [CategoriesService]
})
export class CategoriesCenterComponent { }