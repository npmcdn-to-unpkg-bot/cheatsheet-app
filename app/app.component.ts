import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router }  from '@angular/router';
import { NgForm }    from '@angular/common';

import { AuthService } from './auth.service';
import { User } from './users/user';
import { UsersService } from './users/users.service';

declare var jQuery:any

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [ ROUTER_DIRECTIVES ],
  providers: [UsersService]
})
export class AppComponent { 
  errorLogin:boolean = false;
  showError:boolean = false;
  msgErrorLogin:string = "";
  username:string = "";
  loginModel:User = new User();

  constructor(
    private _AuthService:AuthService,
    private _UsersService:UsersService,
    private _Router:Router){};

  onSubmit(){
    this._UsersService.login(this.loginModel.email, this.loginModel.password)
    .then(res => 
    {
      this.saveLogin(res),
      this.loginModel = new User(),
      this.showError = true,
      this.errorLogin = false,
      this.msgErrorLogin = ''
    })
    .catch(err => {
      if(err.name === '404'){
        this.errorLogin = true
      }
      this.msgErrorLogin = err.message,
      this.showError = true
    });
    
  }

  saveLogin(data:any){
    let jsonUser = data.user;
    let user = new User();
    user.email = jsonUser.email;
    user.password = "";
    user.name = jsonUser.name;
    user.is_admin = jsonUser.is_admin;

    this._AuthService.login(data.token, user)
    .subscribe(() => {
      jQuery('#loginModal').modal('hide');
    });    
  }

  isCurrentRoute(route:string): boolean {
    let currentRoute = this._Router.url.split('/')[1];
    
    if(currentRoute === route){
      return true;
    }

    return false;
  }

  logout(){
     this._AuthService.logout()
    .subscribe(() => {
      this._Router.navigate(['/']);
    });
  }

  editUser(){
    this._Router.navigate(['/users/' + this._AuthService.getUser().email]);
  }

  isUserLogin():boolean{
    let isLogged:boolean = this._AuthService.isLoggedIn();
    if(isLogged){
      this.username = this._AuthService.getUser().name;
    }
    return isLogged;
  }

  isAdminUserLogin():boolean{
    return this._AuthService.isAdminUser();
  }
}
