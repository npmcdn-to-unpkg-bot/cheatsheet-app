import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { User } from './users/user';

@Injectable()
export class AuthService{

  isLoggedIn(){
    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('user'));

    if(token && user){
      return true;
    }
    
    return false;
  }

  isAdminUser(){
     if(this.isLoggedIn() && this.getUser().is_admin){
       return true;
     }

     return false;
  }

  getToken():string{
    return localStorage.getItem('token');
  }

  getUser():User{
    let jsonUser = JSON.parse(localStorage.getItem('user'));
    let user = new User();
    user.email = jsonUser.email;
    user.password = "";
    user.name = jsonUser.name;
    user.is_admin = jsonUser.is_admin;

    return user;
  }

  login(token:string, user:User){
    localStorage.setItem('token', token);
    localStorage.setItem('user', user.toStringify());
    return Observable.of(true);
  }

  logout() {
    localStorage.clear();
    
    return Observable.of(true);
  }
}