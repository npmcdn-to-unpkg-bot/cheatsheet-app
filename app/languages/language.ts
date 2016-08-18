import { Injectable } from '@angular/core';

@Injectable()
export class Language{
  extension:string;
  name:string;

  constructor(){
    this.extension = "";
    this.name = "";
  }

  toStringify():string{
    return JSON.stringify({
      'extension': this.extension,
      'name': this.name
    });
  }

  toJSON():JSON{
    return JSON.parse(
      this.toStringify()
      );
  }

  public static fromJson(languageJson:any):Language{
    let language:Language = new Language();

    language.extension = languageJson.extension;
    language.name = languageJson.name;

    return language;
  }
}