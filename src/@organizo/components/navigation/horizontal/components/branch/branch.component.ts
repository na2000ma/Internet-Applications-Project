import {BooleanInput} from '@angular/cdk/coercion';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenu, MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Subject, takeUntil} from 'rxjs';
import {
  OrganizoHorizontalNavigationBasicItemComponent
} from "@organizo/components/navigation/horizontal/components/basic/basic.component";
import {OrganizoNavigationItem} from "@organizo/components/navigation/navigation.types";
import {OrganizoHorizontalNavigationComponent} from "@organizo/components/navigation/horizontal/horizontal.component";
import {OrganizoNavigationService} from "@organizo/components/navigation/navigation.service";
import {
  OrganizoHorizontalNavigationDividerItemComponent
} from "@organizo/components/navigation/horizontal/components/divider/divider.component";

@Component({
  selector: 'organizo-horizontal-navigation-branch-item',
  templateUrl: './branch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, MatMenuModule, NgTemplateOutlet, OrganizoHorizontalNavigationBasicItemComponent, forwardRef(() => OrganizoHorizontalNavigationBranchItemComponent), OrganizoHorizontalNavigationDividerItemComponent, MatTooltipModule, MatIconModule],
})
export class OrganizoHorizontalNavigationBranchItemComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_child: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() child: boolean = false;
  @Input() item: OrganizoNavigationItem;
  @Input() name: string;
  @ViewChild('matMenu', {static: true}) matMenu: MatMenu;

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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Trigger the change detection
   */
  triggerChangeDetection(): void {
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

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
