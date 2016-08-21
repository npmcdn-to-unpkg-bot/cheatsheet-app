import { Component } from '@angular/core';

import { Database } from './database';
import { DatabaseService } from './database.service';
import { AuthService } from '../auth.service';

import 'rxjs/Rx';

@Component({
  templateUrl: 'app/database/database.component.html',
  providers: [DatabaseService]
})
export class DatabaseComponent { 
  fileNameImport:string;
  database:Database;
  msgError:string;
  showMsgError:boolean = false;

  constructor(
    private _DatabaseService:DatabaseService,
    private _AuthService:AuthService
  ){}

  onChangeFileNameImport(item:any){
    this.fileNameImport = item.files[0].name;

    this.fileToJSON(item.files[0])
    .then(res => {
      this.database = new Database(res);
    })
    .catch(e => {
      this.msgError = 'Error al importar el fichero: ' + e.message;
      this.showMsgError = true;
    });    
  }

  fileToJSON(file:any):Promise<JSON>{

    return new Promise(
      function(resolve, reject){
        let reader = new FileReader();
        reader.onload = (function(theFile:any) {
          return function(e:any) {
            try{
              let jsonDb:JSON = JSON.parse(e.target.result);
              resolve(jsonDb);
            }catch(e){
              reject(e);
            }
          };
        })(file);

        reader.readAsText(file);
      });    
  }

  saveImportFile(){
    this._DatabaseService
    .import(this.database, this._AuthService.getToken())
    .then(() => {
      alert('ok');
    })
    .catch(err => {
      this.msgError = err.message;
      this.showMsgError = true;
    });
  }

  getExportData(a:any){
    this._DatabaseService.export(this._AuthService.getToken())
    .then(res => {
      this.database = new Database(res);
      let blob = new Blob([JSON.stringify(this.database.databaseJSON)], { type: 'text/plain' });
      a.href = window.URL.createObjectURL(blob);
      a.download = "cheatsheets_db.back";
      a.click();
    })
    .catch(err => {
      this.msgError = err.message;
      this.showMsgError = true;
    });
  }

  clearDatabase(){
    this._DatabaseService
    .clear(this._AuthService.getToken())
    .then(() => {
      localStorage.clear();
    })
    .catch(err => {
      this.msgError = err.message;
      this.showMsgError = true;
    });
  }
}
