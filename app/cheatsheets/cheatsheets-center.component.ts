
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { CheatSheetsService } from './cheatsheets.service';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [CheatSheetsService]
})
export class CheatSheetsCenterComponent { }