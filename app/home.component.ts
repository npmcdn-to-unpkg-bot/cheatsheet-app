import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { Category } from './categories/category';
import { CheatSheet } from './cheatsheets/cheatsheet';
import { CategoriesService } from './categories/categories.service';
import { CheatSheetsService } from './cheatsheets/cheatsheets.service';

@Component({
  templateUrl: 'app/home.component.html',
  providers: [CategoriesService, CheatSheetsService]
})
export class HomeComponent implements OnInit{
  categories:Category[];
  latestCheatSheets:CheatSheet[];

  constructor(
    private _CategoriesService:CategoriesService,
    private _CheatSheetsService:CheatSheetsService,
    private _Router:Router
  ){}

  ngOnInit(){
    this.getCheatSheets();
    this.getLatestCheatSheets();
  }

  getCheatSheets(){
    this._CategoriesService.getAllWithCheatSheetsList()
    .then(res => {
      this.categories = res;
    })
    .catch();
  }

  getLatestCheatSheets(){
    this._CheatSheetsService.getLatest()
    .then(res => {
      this.latestCheatSheets = res;
    })
    .catch();
  }

  viewCheatSheet(id:number){
    this._Router.navigate(['/cheatsheets/view', id]);
  }
}
