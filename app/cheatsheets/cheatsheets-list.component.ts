import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category';
import { CheatSheet } from '../cheatsheets/cheatsheet';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/cheatsheets/cheatsheets-list.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [CategoriesService]
})
export class CheatSheetsListComponent implements OnInit{ 
  categories:Category[] = [];

  constructor(
    private _CategoriesService:CategoriesService, 
    private _AuthService:AuthService,
    private _Router:Router
  ){};

  ngOnInit(){
    this._CategoriesService.getAllWithCheatSheetsList()
    .then(res => {this.categories = res;})
    .catch(err => {
    });
  }

  gotoDetail(cheatsheet:CheatSheet) {
    this._Router.navigate(['/cheatsheets/', cheatsheet.id]);
  }

  isAdminLogged(){
    return this._AuthService.isAdminUser();
  }
}
