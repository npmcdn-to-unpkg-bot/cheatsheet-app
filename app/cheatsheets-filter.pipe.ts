import { Pipe } from "@angular/core";

import { CheatSheet } from './cheatsheets/cheatsheet';

@Pipe({
    name: "filterCheatSheets"
})
export class CheatSheetsFilterPipe {

    transform(chetasheets: Array<CheatSheet>, args:any): Array<CheatSheet> {

        let filterText:string = args;
        if ((typeof chetasheets === "undefined") || (args.length < 1)) {
            return chetasheets;
        }

        return chetasheets.filter(item => {
         if((item.title.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.comment.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.code.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.category.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
            || (item.language.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
          )
            return true;
        
       });
    }
}