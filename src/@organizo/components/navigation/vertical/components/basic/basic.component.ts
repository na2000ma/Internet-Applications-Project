import {NgClass, NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {OrganizoNavigationItem} from "@organizo/components/navigation/navigation.types";
import {OrganizoVerticalNavigationComponent} from "@organizo/components/navigation/vertical/vertical.component";
import {OrganizoNavigationService} from "@organizo/components/navigation/navigation.service";
import {OrganizoUtilsService} from "@organizo/services/utils/organizo-utils.service";

@Component({
  selector: 'organizo-vertical-navigation-basic-item',
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, MatTooltipModule, NgTemplateOutlet, MatIconModule],
})
export class OrganizoVerticalNavigationBasicItemComponent implements OnInit, OnDestroy {
  @Input() item: OrganizoNavigationItem;
  @Input() name: string;

  isActiveMatchOptions: IsActiveMatchOptions;
  private _organizoVerticalNavigationComponent: OrganizoVerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _organizoNavigationService: OrganizoNavigationService,
    private _organizoUtilsService: OrganizoUtilsService,
  ) {
    // Set the equivalent of {exact: false} as default for active match options.
    // We are not assigning the item.isActiveMatchOptions directly to the
    // [routerLinkActiveOptions] because if it's "undefined" initially, the router
    // will throw an error and stop working.
    this.isActiveMatchOptions = this._organizoUtilsService.subsetMatchOptions;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the "isActiveMatchOptions" either from item's
    // "isActiveMatchOptions" or the equivalent form of
    // item's "exactMatch" option
    this.isActiveMatchOptions =
      this.item.isActiveMatchOptions ?? this.item.exactMatch
        ? this._organizoUtilsService.exactMatchOptions
        : this._organizoUtilsService.subsetMatchOptions;

    // Get the parent navigation component
    this._organizoVerticalNavigationComponent = this._organizoNavigationService.getComponent(this.name);

    // Mark for check
    this._changeDetectorRef.markForCheck();

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
