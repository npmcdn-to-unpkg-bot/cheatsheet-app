import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { Language } from './language';
import { LanguagesService } from './languages.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/languages/languages-list.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class LanguagesListComponent implements OnInit{ 
  languages:Language[];

  constructor(
    private _LanguagesService:LanguagesService, 
    private _AuthService:AuthService,
    private _Router:Router){}

  ngOnInit(){
    this._LanguagesService
    .getAll()
    .then(res => {
      this.languages = res;
    })
    .catch(err => {
      
    });
  }

  gotoDetail(language:Language) {
    this._Router.navigate(['/languages/', language.extension]);
  }

  isAdminLogged(){
    return this._AuthService.isAdminUser();
  }
}
