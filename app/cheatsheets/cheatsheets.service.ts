import { Injectable, Component } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { API } from '../api';
import { CheatSheet } from './cheatsheet';

@Injectable()
export class CheatSheetsService {
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

  getAll(): Promise<CheatSheet[]>{
      return this.http.get(API.cheatsheets,
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        let jsonCheatsheets:any[] = response.json().cheatsheets;
        let cheatsheets:CheatSheet[];

        jsonCheatsheets.forEach(c => {
          cheatsheets.push(CheatSheet.fromJson(c));
        });
        return cheatsheets;
      })
      .catch(err => {

      });
  }

  getLatest(): Promise<CheatSheet[]>{
      return this.http.get(API.cheatsheets + '/latest',
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        let jsonCheatsheets:any[] = response.json().cheatsheets;
        let cheatsheets:CheatSheet[] = [];

        jsonCheatsheets.forEach(c => {
          let cheatsheet:CheatSheet = CheatSheet.fromJson(c);
          cheatsheets.push(cheatsheet);
        });
        
        return cheatsheets;
      })
      .catch(err => {

      });
  }

  getOnly(id:number): Promise<CheatSheet>{
    return this.http.get(API.cheatsheets + '/' + id, 
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonCheatSheet = response.json().cheatsheet;
          return CheatSheet.fromJson(jsonCheatSheet);
        }else{
          throw response;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'El id de la chuleta no existe');
        }else{
          throw this.generateError(err.status);
        }
    });
  }

  create(cheatSheet:CheatSheet, token:string): Promise<CheatSheet>{
    return this.http.post(API.cheatsheets, 
      JSON.stringify({ 'cheatsheet': cheatSheet.toJSON() }) , 
      { headers: this.getAuthHeader(token) })
      .toPromise()
      .then(res => {
        if(res.status === 201){
          return CheatSheet.fromJson(res.json().cheatsheet);
        }else{
          throw res;
        }
      })
      .catch(err => {
        if(err.status === 403){
          throw this.generateError(err.status,'No estás logueado o la sesión a caducado');
        }else{
          throw this.generateError(err.status);
        }
    });
  }

  edit(cheatSheet:CheatSheet, token:string): Promise<CheatSheet>{
    return this.http.put(
      API.cheatsheets + '/' + cheatSheet.id, 
      JSON.stringify({'cheatsheet':cheatSheet.toJSON()}), 
      { headers: this.getAuthHeader(token)} )
      .toPromise()
      .then(res => {
        if(res.status === 200){
          return CheatSheet.fromJson(res.json().cheatsheet);
        }else{
          throw res;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'La id de la chuleta no existe');
        }else{
          throw this.generateError(err.status);
        }
    });
  }

  editDeprecated(id:number, is_deprecated:boolean, token:string):Promise<boolean>{
    return this.http.patch(API.cheatsheets + '/is_deprecated/' + id, 
    JSON.stringify({'cheatsheet':{ 'is_deprecated': is_deprecated }}),
    { headers: this.getAuthHeader(token)})
    .toPromise()
    .then(res => {
        if(res.status === 200){
          return true;
        }
        throw res;
      })
    .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'El id de la chuleta no existe');
        }else{
          throw this.generateError(err.status);
        }
    });
  }

  delete(id:number, token:string): Promise<boolean>{
    return this.http
      .delete(API.cheatsheets + '/' + id, new RequestOptions({ headers: this.getAuthHeader(token) }))
      .toPromise()
      .then(res => {
        if(res.status === 204){
          return true;
        }
        throw res;
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'La id de la chuleta no existe');
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