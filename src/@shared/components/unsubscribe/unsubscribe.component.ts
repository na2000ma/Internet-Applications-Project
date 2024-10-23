import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";

@Component({
  selector: 'organizo-unsubscribe',
  template: ''
})
export class UnsubscribeComponent implements OnDestroy {
  public subscriptions: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
