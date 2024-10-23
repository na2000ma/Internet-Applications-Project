import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {Subject, takeUntil} from 'rxjs';
import {OrganizoLoadingService} from "@organizo/services/loading/loading.service";

@Component({
  selector: 'organizo-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'organizoLoadingBar',
  standalone: true,
  imports: [MatProgressBarModule],
})
export class OrganizoLoadingBarComponent implements OnChanges, OnInit, OnDestroy {
  @Input() autoMode: boolean = true;
  mode: 'determinate' | 'indeterminate';
  progress: number = 0;
  show: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private _organizoLoadingService: OrganizoLoadingService,
              private cdr: ChangeDetectorRef) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Auto mode
    if ('autoMode' in changes) {
      // Set the auto mode in the service
      this._organizoLoadingService.setAutoMode(coerceBooleanProperty(changes.autoMode.currentValue));
    }
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the service
    this._organizoLoadingService.mode$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.mode = value;
      });

    this._organizoLoadingService.progress$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.progress = value;
      });

    this._organizoLoadingService.show$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.show = value;
        this.cdr.detectChanges();
      });

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
