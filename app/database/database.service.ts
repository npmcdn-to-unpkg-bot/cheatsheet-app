import { Injectable, Component } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { API } from '../api';
import { Database } from './database';

@Injectable()
export class DatabaseService {
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

  export(token:string): Promise<Database>{
    return this.http.get(API.data,
    {headers: this.getAuthHeader(token)})
    .toPromise()
    .then(res => {
      if(res.status === 200){
          return res.json();
        }else{
          throw res;
        }
    })
    .catch(err => {this.generateError(err.status)});
  }

  import(database:Database, token:string): Promise<boolean>{
      return null;
  }

  clear(token:string): Promise<boolean>{
      return null;
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