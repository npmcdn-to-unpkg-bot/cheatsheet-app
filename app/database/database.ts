import { Injectable } from '@angular/core';

@Injectable()
export class Database{
  databaseJSON:any;

  constructor(databaseJSON:any){
    this.databaseJSON = databaseJSON;
  }
}