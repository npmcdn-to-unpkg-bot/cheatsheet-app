import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/common';
import { Router,ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { User } from './user';
import { UsersService } from './users.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/users/users-edit.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class UsersEditComponent implements OnInit{ 
  model:User = new User();
  confirmPassword:string = "";
  showMsgErr:boolean = false;
  msgError:string[] = [];
  changePassword:boolean = false;


  formError:any = {
    emailNotExists: false,
    minLengthPass: false,
    confirmPassword: false,
    minLengthName: false,
  }

  constructor(
    private _UsersService:UsersService,
    private _Router:Router,
    private _ActivatedRoute:ActivatedRoute,
    private _AuthService:AuthService
    ){}

    ngOnInit(){
    this._ActivatedRoute.params.subscribe(params => {
      if(this.isAuthorized(params['email'])){
        this._UsersService.getOnly(params['email'], this._AuthService.getToken())
        .then(res => this.model = res)
        .catch(err => {
          this.showError(err.message);
          this.formError.emailNotExists = true;
        });
      }else{
        this.goBack();
      }
    });
  }

  isAuthorized(emailRequest:string):boolean{
    if((!this._AuthService.isAdminUser) 
    && ( this._AuthService.getUser().email != emailRequest )){
      return false;
    }

    return true;
  }

  isAdminLogged(){
    return this._AuthService.isAdminUser();
  }

  onSubmit(){
    
    this.checkError();
    this.showError();

    if(!this.showMsgErr){
      if(this.changePassword){
        this._UsersService.changePassword(
          this.model.email, 
          this.model.password, 
          this._AuthService.getToken())
        .then(() => this.editUser())
        .catch(err =>{
          this.showError(err.message);
        });
      }else{
        this.editUser();
      }
    }

  }

  onChangePassword(event:any){
    this.changePassword = event.currentTarget.checked;
  }

  editUser(){
    this._UsersService.edit(this.model, this._AuthService.getToken())
    .then(() => this._Router.navigate(['/users'])
    )
    .catch(err =>{
          this.showError(err.message);
    });
  }

  goBack() {
    window.history.back();
  }

  checkError(){
    this.formError.emailExists = false;
    this.formError.minLengthPass = false;
    this.formError.confirmPassword = false;
    this.formError.minLengthName = false;

    if(this.changePassword){
      if(this.model.password.length < 4){
        this.formError.minLengthPass = true;
      }
      if(this.model.password != this.confirmPassword){
        this.formError.confirmPassword = true;
      }
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

  goDelete(){
    this._UsersService.delete(this.model.email, this._AuthService.getToken())
    .then(() => this._Router.navigate(['/users']))
    .catch(err => this.showError(err.message));
  }
}
