import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { CheatSheet } from './cheatsheet';
import { Category } from '../categories/category';
import { Language } from '../languages/language';
import { CheatSheetsService } from './cheatsheets.service';
import { LanguagesService } from '../languages/languages.service';
import { CategoriesService } from '../categories/categories.service';
import { AuthService } from '../auth.service';

declare var CKEDITOR:any;
declare var ace:any;

@Component({
  templateUrl: 'app/cheatsheets/cheatsheets-new.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [CategoriesService, LanguagesService]
})
export class CheatSheetsNewComponent implements OnInit{
  model:CheatSheet = new CheatSheet();
  categories:Category[] = [];
  languages:Language[] = [];
  showMsgErr:boolean = false;
  msgError:string;
  editor:any;
  modelistLanguage:any;


  constructor(
    private _CheatSheetsService:CheatSheetsService,
    private _LanguagesService:LanguagesService,
    private _CategoriesService:CategoriesService,
    private _Router:Router,
    private _AuthService:AuthService
    ){}

 ngOnInit(){
   CKEDITOR.replace('commentEditor');
   this.editor = ace.edit("ace-editor");
   this.modelistLanguage = ace.require("ace/ext/modelist");
   this.loadData();
 }

 loadData(){
   this._CategoriesService.getAll()
   .then(res => {
     this.categories = res;
   })
   .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
      return;
    });

    this._LanguagesService.getAll()
   .then(res => {
     this.languages = res;
   })
   .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
 }

 changeLanguageEditor(){
      let tempExt = '.' + this.model.language.extension;
      let mode = this.modelistLanguage.getModeForPath(tempExt).mode;
      this.editor.getSession().setMode(mode);
    }

  onSubmit(){
    this.model.creator_email = this._AuthService.getUser().email;
    this.model.code = this.editor.getValue();
    this.model.comment = CKEDITOR.instances["commentEditor"].getData();

    this._CheatSheetsService.create(this.model, this._AuthService.getToken())
    .then(res => this._Router.navigate(['cheatsheets']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }
}