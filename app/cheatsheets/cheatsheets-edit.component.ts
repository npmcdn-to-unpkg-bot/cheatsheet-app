import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

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
  templateUrl: 'app/cheatsheets/cheatsheets-edit.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [CategoriesService, LanguagesService]
})
export class CheatSheetsEditComponent implements OnInit{
  model:CheatSheet = new CheatSheet();
  categories:Category[] = [];
  languages:Language[] = [];
  showMsgErr:boolean = false;
  idNotExists:boolean = false;
  msgError:string;
  editor:any;
  modelistLanguage:any;


  constructor(
    private _CheatSheetsService:CheatSheetsService,
    private _LanguagesService:LanguagesService,
    private _CategoriesService:CategoriesService,
    private _Router:Router,
    private _ActivatedRoute:ActivatedRoute,
    private _AuthService:AuthService
    ){}

 ngOnInit(){
   CKEDITOR.replace('commentEditor');
   this.editor = ace.edit("ace-editor");
   this.modelistLanguage = ace.require("ace/ext/modelist");
   this.loadAllData();
 }

 loadAllData(){
    this._ActivatedRoute.params.subscribe(params => {
      this.loadCategories().catch(() => {return;})
      .then(() => this.loadLanguages()).catch(() => {return;})
      .then(() => this.loadCheatSheet(params['id']));
    });
  }

  loadCategories(){
    return this._CategoriesService.getAll()
    .then(res => {
      this.categories = res;
    })
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }

  loadLanguages(){
    return this._LanguagesService.getAll()
        .then(res => {
            this.languages = res;
        })
        .catch(err => {
            this.msgError = err.message;
            this.showMsgErr = true;
            });
  }

  loadCheatSheet(id:any){
    return this._CheatSheetsService.getOnly(id)
        .then(res => {
            this.model = res;
            CKEDITOR.instances["commentEditor"].setData(res.comment);
            this.model.category = this.categories.find(r => r.id === this.model.category.id);
            this.model.language = this.languages.find(r => r.extension === this.model.language.extension);
            this.editor.setValue(res.code);
            this.changeLanguageEditor();
        })
        .catch(err => {
            if(err.name === '404'){
                this.idNotExists = true;
            }
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

    this.goEditCheatSheetDeprecated()
    .catch(() => {return;})
    .then(() => this.goEditCheatSheet());
  }

  goEditCheatSheet(){
    return this._CheatSheetsService.edit(this.model, this._AuthService.getToken())
    .then(res => this._Router.navigate(['cheatsheets']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }

  goEditCheatSheetDeprecated(){
    return this._CheatSheetsService
      .editDeprecated(this.model.id, 
      this.model.is_deprecated, this._AuthService.getToken())
      .then()
      .catch(err => {
        this.msgError = err.message;
        this.showMsgErr = true;
      });
  }

  goDelete(){
    this._CheatSheetsService.delete(this.model.id, this._AuthService.getToken())
    .then(() => this._Router.navigate(['/cheatsheets']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }
}