import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { Category } from './category';
import { CategoriesService } from './categories.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/categories/categories-new.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class CategoriesNewComponent {
  model:Category = new Category();
  showMsgErr:boolean = false;
  msgError:string;
  extensionExists:boolean = false;


  constructor(
    private _CategoriesService:CategoriesService,
    private _Router:Router,
    private _AuthService:AuthService
    ){}

  onSubmit(){
    this._CategoriesService.create(this.model, this._AuthService.getToken())
    .then(res => this._Router.navigate(['categories']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }
}