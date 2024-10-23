import {BooleanInput} from '@angular/cdk/coercion';
import {NgClass} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Subject, takeUntil} from 'rxjs';
import {
  OrganizoVerticalNavigationBasicItemComponent
} from "@organizo/components/navigation/vertical/components/basic/basic.component";
import {
  OrganizoVerticalNavigationCollapsableItemComponent
} from "@organizo/components/navigation/vertical/components/collapsable/collapsable.component";
import {
  OrganizoVerticalNavigationDividerItemComponent
} from "@organizo/components/navigation/vertical/components/divider/divider.component";
import {
  OrganizoVerticalNavigationSpacerItemComponent
} from "@organizo/components/navigation/vertical/components/spacer/spacer.component";
import {OrganizoNavigationItem} from "@organizo/components/navigation/navigation.types";
import {OrganizoVerticalNavigationComponent} from "@organizo/components/navigation/vertical/vertical.component";
import {OrganizoNavigationService} from "@organizo/components/navigation/navigation.service";

@Component({
  selector: 'organizo-vertical-navigation-group-item',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, MatIconModule, OrganizoVerticalNavigationBasicItemComponent, OrganizoVerticalNavigationCollapsableItemComponent, OrganizoVerticalNavigationDividerItemComponent, forwardRef(() => OrganizoVerticalNavigationGroupItemComponent), OrganizoVerticalNavigationSpacerItemComponent],
})
export class OrganizoVerticalNavigationGroupItemComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() autoCollapse: boolean;
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for @for loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
