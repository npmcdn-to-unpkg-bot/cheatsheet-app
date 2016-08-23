import { Pipe } from "@angular/core";

import { Category } from "./categories/category";
import { CheatSheet } from "./cheatsheets/cheatsheet";


@Pipe({
    name: "filterCategories",
})
export class CategoriesFilterPipe {
  
  transform(categories: Array<Category>, args:any): Array<Category> {

    if (typeof categories === "undefined") {
      return categories;
    }

    let filterText:string = args;

    return categories.filter(cat => {
      if(this.countCheatsheetsFilter(cat.cheatsheets, filterText)){
        return true;
      }
    });
  }

  private countCheatsheetsFilter(cheatsheets:CheatSheet[], filterText:string):number{
    if(!cheatsheets){
      return 0;
    }
    
    let cs:CheatSheet[] = cheatsheets.filter(item => {
         if((item.title.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.comment.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.code.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.category.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.language.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
          )
            return true;
        
       });

       return cs.length;
  }
}