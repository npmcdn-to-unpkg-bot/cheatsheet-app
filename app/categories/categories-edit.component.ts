import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { Category } from './category';
import { CategoriesService } from './categories.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/categories/categories-edit.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class CategoriesEditComponent implements OnInit{
  model:Category = new Category();
  showMsgErr:boolean = false;
  msgError:string;
  idNotExists:boolean = false;


  constructor(
    private _CategoriesService:CategoriesService,
    private _Router:Router,
    private _ActivatedRoute:ActivatedRoute,
    private _AuthService:AuthService
    ){}

  ngOnInit(){
    this._ActivatedRoute.params.subscribe(params => {
        this._CategoriesService.getOnly(params['id'])
        .then(res => this.model = res)
        .catch(err => {
          if(err.name === '404'){
            this.idNotExists = true;
          }
          this.msgError = err.message;
          this.showMsgErr = true;
        });
    });
  }

  onSubmit(){
    this._CategoriesService.edit(this.model, this._AuthService.getToken())
    .then(res => this._Router.navigate(['categories']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }

  goDelete(){
    this._CategoriesService.delete(this.model.id, this._AuthService.getToken())
    .then(() => this._Router.navigate(['/categories']))
    .catch(err => {
      this.msgError = err.message;
      this.showMsgErr = true;
    });
  }
}