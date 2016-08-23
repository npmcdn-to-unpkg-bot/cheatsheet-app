import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { Category } from './categories/category';
import { CheatSheet } from './cheatsheets/cheatsheet';
import { CategoriesService } from './categories/categories.service';
import { CheatSheetsService } from './cheatsheets/cheatsheets.service';
import { CheatSheetsFilterPipe } from './cheatsheets-filter.pipe';
import { CategoriesFilterPipe } from './categories-filter.pipe';


@Component({
  templateUrl: 'app/home.component.html',
  providers: [CategoriesService, CheatSheetsService],
  pipes: [CheatSheetsFilterPipe, CategoriesFilterPipe]
})
export class HomeComponent implements OnInit{
  categories:Category[];
  latestCheatSheets:CheatSheet[];
  filterText:string = "";

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
