import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { Category } from './category';
import { CategoriesService } from './categories.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/categories/categories-list.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class CategoriesListComponent { 
  categories:Category[];

  constructor(
    private _CategoriesService:CategoriesService, 
    private _AuthService:AuthService,
    private _Router:Router){}

  ngOnInit(){
    this._CategoriesService
    .getAll()
    .then(res => {
      this.categories = res;
    })
    .catch(err => {
      
    });
  }

  gotoDetail(category:Category) {
    this._Router.navigate(['/categories/', category.id]);
  }

  isAdminLogged(){
    return this._AuthService.isAdminUser();
  }
}
