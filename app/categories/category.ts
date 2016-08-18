import { Injectable } from '@angular/core';

import { CheatSheet } from '../cheatsheets/cheatsheet';

@Injectable()
export class Category{
  id:number;
  name:string;
  cheatsheets:CheatSheet[];

  constructor(){
    this.id = -1;
    this.name = "";
    this.cheatsheets = [];
  }

  toStringify():string{
    return JSON.stringify({
      'id': this.id,
      'name': this.name
    });
  }

  toJSON():JSON{
    return JSON.parse(
      this.toStringify()
      );
  }

  public static fromJson(categoryJson:any):Category{
    let category:Category = new Category();

    category.id = categoryJson.id;
    category.name = categoryJson.name;

    return category;
  }

  public static fromJsonWithCheatSheetsList(categoryJson:any):Category{
    let category:Category = new Category();
    let cheatsheetsJSON:any[] = categoryJson.cheatsheets;

    if(cheatsheetsJSON.length < 1){
      return null;
    }

    cheatsheetsJSON.forEach(c => {
      category.cheatsheets.push(CheatSheet.fromJson(c));
    });

    category.id = categoryJson.id;
    category.name = categoryJson.name;

    return category;
  }
}