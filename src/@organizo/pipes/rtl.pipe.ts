import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';


@Pipe({
  name: 'rtl',
  pure: true,
  standalone: true
})
export class RtlPipe implements PipeTransform, OnDestroy {

  langChange: BehaviorSubject<boolean>;
  subscription = new Subscription();

  constructor(private translate: TranslateService) {
    this.langChange = new BehaviorSubject<any>(this.translate.currentLang === 'ar');
    this.subscription.add(
      this.translate.onLangChange.subscribe((value) => {
        this.langChange.next(value.lang === 'ar');
      })
    );
    this.subscription.add(
      this.translate.onDefaultLangChange.subscribe((value) => {
        this.langChange.next(value.lang === 'ar');
      })
    );
  }

  transform(args?: any): Observable<boolean> {
    return this.langChange.asObservable();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
