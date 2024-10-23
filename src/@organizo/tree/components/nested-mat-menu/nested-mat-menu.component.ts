import {Component, Input} from '@angular/core';
import {MatMenuConfig} from "@organizo/tree/models/mat-menu";
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'organizo-nested-mat-menu',
  standalone: true,
  imports: [
    MatMenu,
    MatMenuContent,
    MatMenuItem,
    TranslateModule,
    MatIcon,
    MatMenuTrigger
  ],
  templateUrl: './nested-mat-menu.component.html',
  styleUrl: './nested-mat-menu.component.scss'
})
export class NestedMatMenuComponent {

  config: MatMenuConfig<any>;
  item: any;

  @Input('mat-config') set _config(value: MatMenuConfig<any>) {
    this.config = value;
  }

  @Input('item') set _item(value: any) {
    this.item = value;
  }


}
