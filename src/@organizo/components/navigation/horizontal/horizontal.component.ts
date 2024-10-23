import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {OrganizoHorizontalNavigationBasicItemComponent} from './components/basic/basic.component';
import {OrganizoHorizontalNavigationBranchItemComponent} from './components/branch/branch.component';
import {OrganizoHorizontalNavigationSpacerItemComponent} from './components/spacer/spacer.component';
import {OrganizoNavigationItem} from "@organizo/components/navigation/navigation.types";
import {OrganizoNavigationService} from "@organizo/components/navigation/navigation.service";
import {OrganizoUtilsService} from "@organizo/services/utils/organizo-utils.service";
import {organizoAnimations} from "@organizo/animations/organizo.animations";

@Component({
  selector: 'organizo-horizontal-navigation',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss'],
  animations: organizoAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'organizoHorizontalNavigation',
  standalone: true,
  imports: [OrganizoHorizontalNavigationBasicItemComponent, OrganizoHorizontalNavigationBranchItemComponent, OrganizoHorizontalNavigationSpacerItemComponent],
})
export class OrganizoHorizontalNavigationComponent implements OnChanges, OnInit, OnDestroy {
  @Input() name: string = this._organizoUtilsService.randomId();
  @Input() navigation: OrganizoNavigationItem[];

  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _organizoNavigationService: OrganizoNavigationService,
    private _organizoUtilsService: OrganizoUtilsService,
  ) {
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
    // Navigation
    if ('navigation' in changes) {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Make sure the name input is not an empty string
    if (this.name === '') {
      this.name = this._organizoUtilsService.randomId();
    }

    // Register the navigation component
    this._organizoNavigationService.registerComponent(this.name, this);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Deregister the navigation component from the registry
    this._organizoNavigationService.deregisterComponent(this.name);

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Refresh the component to apply the changes
   */
  refresh(): void {
    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Execute the observable
    this.onRefreshed.next(true);
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
