import { Injectable } from '@angular/core';

import { Category } from '../categories/category';
import { Language } from '../languages/language';

@Injectable()
export class CheatSheet{
  id:number;
  title:string;
  comment:string;
  code:string;
  category:Category;
  creator_email:string;
  language:Language;
  is_deprecated:boolean = false;

  constructor(){
    this.id = -1;
    this.title = "";
    this.comment = "";
    this.code = "";
    this.category = new Category();
    this.creator_email = "";
    this.language = new Language();
  }

  toStringify():string{
    return JSON.stringify({
      'id': this.id,
      'title': this.title,
      'comment': this.comment,
      'code': this.code,
      'category': this.category.toJSON(),
      'creator_email': this.creator_email,
      'language': this.language.toJSON(),
      'is_deprecated':this.is_deprecated
    });
  }

  toJSON():JSON{
    return JSON.parse(
      this.toStringify()
      );
  }

  public static fromJson(cheatsheetJson:any):CheatSheet{
    let cheatsheet:CheatSheet = new CheatSheet();

    cheatsheet.id = cheatsheetJson.id;
    cheatsheet.title = cheatsheetJson.title;
    cheatsheet.comment = cheatsheetJson.comment;
    cheatsheet.code = cheatsheetJson.code;
    cheatsheet.creator_email = cheatsheetJson.creator_email;
    cheatsheet.category = Category.fromJson(cheatsheetJson.category);
    cheatsheet.language = Language.fromJson(cheatsheetJson.language);
    cheatsheet.is_deprecated = cheatsheetJson.is_deprecated;

    return cheatsheet;
  }
}
