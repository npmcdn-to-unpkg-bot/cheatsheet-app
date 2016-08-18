import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { CheatSheet } from './cheatsheet';
import { Category } from '../categories/category';
import { Language } from '../languages/language';
import { CheatSheetsService } from './cheatsheets.service';

declare var ace:any;

@Component({
  templateUrl: 'app/cheatsheets/cheatsheets-view.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class CheatSheetsViewComponent implements OnInit{
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
    private _Router:Router,
    private _ActivatedRoute:ActivatedRoute
    ){}

    ngOnInit(){
      this.editor = ace.edit("ace-editor");
      this.modelistLanguage = ace.require("ace/ext/modelist");
      this.editor.setReadOnly(true);
      this.editor.setShowPrintMargin(false);
      this.editor.getSession().setUseWrapMode(true);
      this.editor.session.selection.clearSelection();

      this._ActivatedRoute.params.subscribe(params => {
        this._CheatSheetsService.getOnly(params['id'])
        .then(res => {
            this.model = res;
            this.editor.setValue(res.code,-1);
            let tempExt = '.' + this.model.language.extension;
            let mode = this.modelistLanguage.getModeForPath(tempExt).mode;
            this.editor.getSession().setMode(mode);
        })
        .catch();
    });
    }
}
