import { Injectable, Component } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { API } from '../api';
import { Category } from './category';

@Injectable()
export class CategoriesService {
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

  getAll(): Promise<Category[]>{
    return this.http.get(API.categories + '/list', 
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonCategories:any[] = response.json().categories;
          let categories:Category[] = [];
          jsonCategories.forEach(c => {
            categories.push(Category.fromJson(c));
          });

          return categories;
        }else{
          throw response;
        }
      })
      .catch(err => {
        throw this.generateError(err.status)
      });
  }

  getAllWithCheatSheetsList(): Promise<Category[]>{
    return this.http.get(API.categories, 
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonCategories:any[] = response.json().categories;
          let categories:Category[] = [];
          jsonCategories.forEach(c => {
            let cat:Category = Category.fromJsonWithCheatSheetsList(c);
            if(cat !== null){
              categories.push(cat);
            }
          });

          return categories;
        }else{
          throw response;
        }
      })
      .catch(err => {
        throw this.generateError(err.status)
      });
  }

  getOnly(id:number): Promise<Category>{
    return this.http.get(API.categories + '/' + id, 
      {headers: this.getHeader()})
      .toPromise()
      .then(response => {
        if(response.status === 200){
          let jsonCategory = response.json().category;
          return Category.fromJson(jsonCategory);
        }else{
          throw response;
        }
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'El id de categoría no existe');
        }else{
          throw this.generateError(err.status);
        }
    });
  }

  create(category:Category, token:string): Promise<Category>{
    return this.http.post(API.categories, 
      JSON.stringify({ 'category': category.toJSON() }) , 
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

  edit(category:Category, token:string): Promise<Category>{
    return this.http.put(
      API.categories + '/' + category.id, 
      JSON.stringify({'category':category.toJSON()}), 
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
          throw this.generateError(err.status,'La id de categoría no existe');
        }else{
          throw this.generateError(err.status);
        }
    });
  }

  delete(id:number, token:string): Promise<boolean>{
    return this.http
      .delete(API.languages + '/' + id, new RequestOptions({ headers: this.getAuthHeader(token) }))
      .toPromise()
      .then(res => {
        if(res.status === 204){
          return true;
        }
        throw res;
      })
      .catch(err => {
        if((err.status === 404) && err.json() && err.json().message){
          throw this.generateError(err.status,'La id de categoría no existe');
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