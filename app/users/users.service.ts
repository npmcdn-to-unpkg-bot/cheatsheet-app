import { Injectable, Component } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { API } from '../api';
import { User } from './user';

@Injectable()
export class UsersService {
  constructor(
    private http: Http
  ) {}

  getHeader():Headers{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return headers;
  }


  getAuthHeader(token:string):Headers{
    let headers = this.getHeader();
    headers.append('token', token);

    return headers;
  }

  getAll(token:string): Promise<User[]>{
    
    return this.http.get(API.users, 
      {headers: this.getAuthHeader(token)})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonUsers:any[] = response.json().users;
          let users:User[] = [];
          jsonUsers.forEach(u => {
            users.push(User.fromJson(u));
          });

          return users;
        }else{
          throw response;
        }
      })
      .catch(err => {
        throw this.generateError(err.status)
      });
  }

  getOnly(email:string, token:string): Promise<User>{
    return this.http.get(API.users + '/' + email, 
      {headers: this.getAuthHeader(token)})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonUser = response.json().user;
          return User.fromJson(jsonUser);
        }else{
          throw response;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'El usuario no existe');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  create(user:User, token:string): Promise<User>{
    return this.http.post(API.users, 
      JSON.stringify({ 'user': user.toJSON() }) , 
      { headers: this.getAuthHeader(token) })
      .toPromise()
      .then(res => {
        if(res.status === 201){
          return res.json();
        }else{
          throw res;
        }
      })
      .catch(err => {
        if(err.status === 403){
          throw this.generateError(err.status,'Este usuario no tiene permisos para crear usuarios');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  changePassword(email:string, password:string, token:string): Promise<User>{
    return this.http.patch(
      API.users + '/password/' + email, 
      JSON.stringify({'user':{'password':password}}), 
      { headers: this.getAuthHeader(token)} )
      .toPromise()
      .then(res => {
        if(res.status === 200){
          return res.json();
        }else{
          throw res;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'El email no existe');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  edit(user:User, token:string): Promise<User>{
    return this.http.patch(
      API.users + '/' + user.email, 
      JSON.stringify({'user':user.toJSON()}), 
      { headers: this.getAuthHeader(token)} )
      .toPromise()
      .then(res => {
        if(res.status === 200){
          return res.json();
        }else{
          throw res;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'El email no existe');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  delete(email:string, token:string): Promise<boolean>{
    return this.http
      .delete(API.users + '/' + email, new RequestOptions({ headers: this.getAuthHeader(token) }))
      .toPromise()
      .then(res => {
        if(res.status === 204){
          return true;
        }
        throw res;
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'El email no existe');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  login(email:string, password:string): Promise<any>{

    return this.http.post(API.users + '/login', 
      JSON.stringify({'user':{ 'email': email, 'password': password }}), 
      { headers: this.getHeader() })
      .toPromise()
      .then(res => {
        if(res.status === 200){
          return res.json();
        }else{
          throw res;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'Usuario y contraseña no son válidos');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  generateError(status:number, msg?:string):Error{
    let err:Error;

    if(msg){
      err = new Error(msg);
    }else{
      switch (status) {
        case 403:
          err = new Error('No estás loggeado o la sesión a caducado');
          break;
        case 404:
          err = new Error('El servidor no responde');
          break;
        case 409:
          err = new Error('El email ya existe');
          break;
        case 422:
          err = new Error('Incorrect JSON received');
          break;
        case 503:
          err = new Error('Error al conectar con la base de datos');
          break;
        default:
          err = new Error('Error desconocido');
      }
    }

    err.name = status.toString();

    return err;
  }
}