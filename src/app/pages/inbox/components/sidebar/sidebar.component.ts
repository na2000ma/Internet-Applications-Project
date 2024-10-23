import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {OrganizoNavigationItem} from "@organizo/components/navigation/navigation.types";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";


@Component({
    selector     : 'inbox-sidebar',
    templateUrl  : './sidebar.component.html',
    styleUrls    : ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InboxSidebarComponent extends UnsubscribeComponent implements OnInit, OnDestroy
{
    menuData: OrganizoNavigationItem[] = [];


    constructor(private router : Router, private store : Store
    )
    {
      super();
    }

    ngOnInit(): void {

      this.menuData = [
        {
          title: 'MAILBOXES',
          type: 'group',
          children: [
            {
              id: '1',
              title: 'inbox',
              type: 'basic',
              icon: 'organizo-outline-icons:inbox',
              link: '/inbox/sidebar',
            }
          ]
        }
      ]
    }
}
