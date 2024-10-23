import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {OrganizoMediaWatcherService} from "@organizo/services/media-watcher/media-watcher.service";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";

@Component({
  selector: 'organizo-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent extends UnsubscribeComponent implements OnInit{
  @ViewChild('drawer') drawer: MatDrawer;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;


  constructor(private _mediaWatcherService: OrganizoMediaWatcherService)
  {
    super();
  }



  ngOnInit(): void
  {
    // Subscribe to media changes
  this.subscriptions.add(this._mediaWatcherService.onMediaChange$
      .subscribe(({matchingAliases}) =>
      {
        // Set the drawerMode and drawerOpened if the given breakpoint is active
        if ( matchingAliases.includes('md') )
        {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        }
        else
        {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }
      }));
  }

}
