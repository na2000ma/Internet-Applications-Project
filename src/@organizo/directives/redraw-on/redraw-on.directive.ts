import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';


@Directive({
  selector: '[redrawOn]',
  standalone: true
})
export class RedrawOnDirective implements AfterViewInit, OnDestroy {
  @Input('redrawOn') event$: Observable<any>;
  subscriptions = new Subscription();

  constructor(private template: TemplateRef<any>,
              private container: ViewContainerRef,
              private cdr: ChangeDetectorRef) {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.event$) {
      this.subscriptions.add(
        this.event$.pipe(map((v) => !!v)).subscribe((val) => {
          if (val) {
            this.container.clear();
            this.container.createEmbeddedView(this.template);
            this.cdr.detectChanges();
          }
        })
      );
    }
  }
}
