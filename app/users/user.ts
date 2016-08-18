import { Injectable } from '@angular/core';

@Injectable()
export class User{
  email:string;
  password:string;
  name:string;
  is_admin:boolean;

  constructor(){
    this.email = "";
    this.password = "";
    this.name = "";
    this.is_admin = false;
  }

  toStringify():string{
    return JSON.stringify({
      'email': this.email,
      'password': this.password,
      'name': this.name,
      'is_admin': this.is_admin
    });
  }

  toJSON():JSON{
    return JSON.parse(
      this.toStringify()
      );
  }

  public static fromJson(userJson:any):User{
    let user:User = new User();

    user.email = userJson.email;
    user.password = "";
    user.name = userJson.name;
    user.is_admin = userJson.is_admin;

    return user;
  }
}