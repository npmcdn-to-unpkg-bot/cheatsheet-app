import { Injectable, Component } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { API } from '../api';
import { Language } from './language';

@Injectable()
export class LanguagesService {
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

  getAll(): Promise<Language[]>{
      return this.http.get(API.languages + '/list', 
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonLanguages:any[] = response.json().languages;
          let languages:Language[] = [];
          jsonLanguages.forEach(l => {
            languages.push(Language.fromJson(l));
          });

          return languages;
        }else{
          throw response;
        }
      })
      .catch(err => {
        throw this.generateError(err.status)
      });
  }

  getOnly(extension:string): Promise<Language>{
      return this.http.get(API.languages + '/' + extension, 
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonLanguage = response.json().language;
          return Language.fromJson(jsonLanguage);
        }else{
          throw response;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'La extensión no existe');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  create(language:Language, token:string): Promise<Language>{
    console.log(language);
      return this.http.post(API.languages, 
      JSON.stringify({ 'language': language.toJSON() }) , 
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
          throw this.generateError(err.status,'No estás logueado o la sesión a caducado');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  edit(language:Language, token:string): Promise<Language>{
      return this.http.put(
      API.languages + '/' + language.extension, 
      JSON.stringify({'language':language.toJSON()}), 
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
          throw this.generateError(err.status,'La extensión no existe');
        }else{
          throw this.generateError(err.status);
        }
      });
  }

  delete(extension:string, token:string): Promise<boolean>{
      return this.http
      .delete(API.languages + '/' + extension, new RequestOptions({ headers: this.getAuthHeader(token) }))
      .toPromise()
      .then(res => {
        if(res.status === 204){
          return true;
        }
        throw res;
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'La extension no existe');
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
          err = new Error('La extensión ya existe');
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