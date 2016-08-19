import { Injectable } from '@angular/core'
@Injectable()
export class API{
  public static mainurl: string = 'http://localhost:8080/api';
  public static users:string = API.mainurl + '/users';
  public static languages:string = API.mainurl + '/languages';
  public static cheatsheets:string = API.mainurl + '/cheatsheets';
  public static categories:string = API.mainurl + '/categories';
  public static data:string = API.mainurl + '/data';
}
