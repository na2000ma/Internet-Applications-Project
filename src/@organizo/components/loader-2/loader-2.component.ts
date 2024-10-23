import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';


import {combineLatestWith, Subscription} from 'rxjs';
import {OrganizoLoadingService} from "@organizo/services/loading/loading.service";
import {AppState} from "@app/store/app.state";
import {Store} from "@ngxs/store";
import {environment} from "@env/environment";

export function playerFactory(): any {
  return import('lottie-web');
}

@Component({
  selector: 'organizo-loader-2',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './loader-2.component.html',
  styleUrl: './loader-2.component.scss'
})
export class Loader2Component implements OnInit, OnDestroy {
  options: AnimationOptions = {
    path: `${environment.base}assets/animations/loader2.json`,
    loop: true,
  };
  subscription = new Subscription()

  pending: boolean;

  constructor(
    private _organizoLoadingService: OrganizoLoadingService,
    private cdr: ChangeDetectorRef,
    private store: Store,
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.subscription.add(
      this._organizoLoadingService.show$.pipe(
        combineLatestWith(this.store.select(AppState.startLoader))
      ).subscribe(value => {
        this.pending = value[0] && value[1]
        this.cdr.detectChanges()
      })
    )
  }


}
