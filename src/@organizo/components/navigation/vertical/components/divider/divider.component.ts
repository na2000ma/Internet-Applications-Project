import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {OrganizoNavigationItem} from "@organizo/components/navigation/navigation.types";
import {OrganizoVerticalNavigationComponent} from "@organizo/components/navigation/vertical/vertical.component";
import {OrganizoNavigationService} from "@organizo/components/navigation/navigation.service";

@Component({
  selector: 'organizo-vertical-navigation-divider-item',
  templateUrl: './divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class OrganizoVerticalNavigationDividerItemComponent implements OnInit, OnDestroy {
  @Input() item: OrganizoNavigationItem;
  @Input() name: string;

  private _organizoVerticalNavigationComponent: OrganizoVerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _organizoNavigationService: OrganizoNavigationService,
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the parent navigation component
    this._organizoVerticalNavigationComponent = this._organizoNavigationService.getComponent(this.name);

    // Subscribe to onRefreshed on the navigation component
    this._organizoVerticalNavigationComponent.onRefreshed.pipe(
      takeUntil(this._unsubscribeAll),
    ).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
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
