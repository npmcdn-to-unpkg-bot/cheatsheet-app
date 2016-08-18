import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { Language } from './language';
import { LanguagesService } from './languages.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/languages/languages-new.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class LanguagesNewComponent {
  model:Language = new Language();
  showMsgErr:boolean = false;
  msgError:string;
  extensionExists:boolean = false;


  constructor(
    private _LanguagesService:LanguagesService,
    private _Router:Router,
    private _AuthService:AuthService
    ){}

  onSubmit(){
    this._LanguagesService.create(this.model, this._AuthService.getToken())
    .then(res => this._Router.navigate(['languages']))
    .catch(err => {
      if(err.name === '409'){
        this.extensionExists = true;
      }
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }
}