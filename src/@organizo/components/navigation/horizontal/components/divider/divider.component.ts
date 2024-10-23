import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {OrganizoNavigationItem} from "@organizo/components/navigation/navigation.types";
import {OrganizoHorizontalNavigationComponent} from "@organizo/components/navigation/horizontal/horizontal.component";
import {OrganizoNavigationService} from "@organizo/components/navigation/navigation.service";

@Component({
  selector: 'organizo-horizontal-navigation-divider-item',
  templateUrl: './divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class OrganizoHorizontalNavigationDividerItemComponent implements OnInit, OnDestroy {
  @Input() item: OrganizoNavigationItem;
  @Input() name: string;

  private _organizoHorizontalNavigationComponent: OrganizoHorizontalNavigationComponent;
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
    this._organizoHorizontalNavigationComponent = this._organizoNavigationService.getComponent(this.name);

    // Subscribe to onRefreshed on the navigation component
    this._organizoHorizontalNavigationComponent.onRefreshed.pipe(
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
