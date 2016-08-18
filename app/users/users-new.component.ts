import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { User } from './user';
import { UsersService } from './users.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/users/users-new.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class UsersNewComponent {
  model:User = new User();
  confirmPassword:string = "";
  showMsgErr:boolean = false;
  msgError:string[] = [];


  formError:any = {
    emailExists: false,
    minLengthPass: false,
    confirmPassword: false,
    minLengthName: false,
  }

  constructor(
    private _UsersService:UsersService,
    private _Router:Router,
    private _AuthService:AuthService
    ){}

  onSubmit(){
    
    this.checkError();
    this.showError();

    if(!this.showMsgErr){
      this.createUser();
    }

  }

  createUser(){
    this._UsersService.create(this.model, this._AuthService.getToken())
    .then(res => this._Router.navigate(['users']))
    .catch(err => {
      if(err.name === '409'){
        this.formError.emailExists = true;
      }
      this.showError(err.message);
    });
  }

  checkError(){
    this.formError.emailExists = false;
    this.formError.minLengthPass = false;
    this.formError.confirmPassword = false;
    this.formError.minLengthName = false;

    if(this.model.password.length < 4){
      this.formError.minLengthPass = true;
    }
    if(this.model.password != this.confirmPassword){
      this.formError.confirmPassword = true;
    }

    if(this.model.name.length < 3){
      this.formError.minLengthName = true;
    }
  }

  showError(msg?:string){
    this.msgError = [];
    this.showMsgErr = false;

    if(msg){
      this.msgError.push(msg);
      this.showMsgErr = true;
    }

    if(this.formError.emailExists){
      this.msgError.push('El email ya existe');
      this.showMsgErr = true;
    }

    if(this.formError.minLengthPass){
      this.msgError.push('El password debe tener 4 carácteres mínimo');
      this.showMsgErr = true;
    }

    if(this.formError.confirmPassword){
      this.msgError.push('Los passwords no coinciden');
      this.showMsgErr = true;
    }

    if(this.formError.minLengthName){
      this.msgError.push('El nombre debe tener 3 o más carácteres');
      this.showMsgErr = true;
    }

  }
}
