import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Subject} from 'rxjs';
import {OrganizoLoadingBarComponent} from "@organizo/components/loading-bar/loading-bar.component";

@Component({
  selector: 'empty-layout',
  templateUrl: './empty.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [OrganizoLoadingBarComponent, RouterOutlet],
})
export class EmptyLayoutComponent implements OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor() {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
