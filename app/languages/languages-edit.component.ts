import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { Language } from './language';
import { LanguagesService } from './languages.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/languages/languages-edit.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class LanguagesEditComponent implements OnInit{
  model:Language = new Language();
  showMsgErr:boolean = false;
  msgError:string;
  extensionNotExists:boolean = false;


  constructor(
    private _LanguagesService:LanguagesService,
    private _Router:Router,
    private _ActivatedRoute:ActivatedRoute,
    private _AuthService:AuthService
    ){}

  ngOnInit(){
    this._ActivatedRoute.params.subscribe(params => {
        this._LanguagesService.getOnly(params['extension'])
        .then(res => this.model = res)
        .catch(err => {
          if(err.name === '404'){
            this.extensionNotExists = true;
          }
          this.msgError = err.message;
          this.showMsgErr = true;
        });
    });
  }

  onSubmit(){
    this._LanguagesService.edit(this.model, this._AuthService.getToken())
    .then(res => this._Router.navigate(['languages']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }

  goDelete(){
    this._LanguagesService.delete(this.model.extension, this._AuthService.getToken())
    .then(() => this._Router.navigate(['/languages']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }
}