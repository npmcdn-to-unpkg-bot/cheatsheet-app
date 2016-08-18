import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES } from '@angular/router';

import { User } from './user';
import { UsersService } from './users.service';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'app/users/users-list.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class UsersListComponent implements OnInit{ 
  users:User[];

  constructor(
    private _UsersService:UsersService, 
    private _AuthService:AuthService,
    private _Router:Router){}

  ngOnInit(){
    this._UsersService
    .getAll(this._AuthService.getToken())
    .then(res => {
      this.users = res;
    })
    .catch(err => alert(err));
  }

  gotoDetail(user:User) {
    this._Router.navigate(['/users/', user.email]);
  }
}
