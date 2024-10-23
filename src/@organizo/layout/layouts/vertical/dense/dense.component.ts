import {NgClass} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterOutlet} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {OrganizoLoadingBarComponent} from "@organizo/components/loading-bar/loading-bar.component";
import {OrganizoVerticalNavigationComponent} from "@organizo/components/navigation/vertical/vertical.component";
import {OrganizoFullscreenComponent} from "@organizo/components/fullscreen/fullscreen.component";
import {NotificationsComponent} from "@organizo/layout/common/notifications/notifications.component";
import {UserComponent} from "@organizo/layout/common/user/user.component";
import {Navigation} from "@organizo/services/navigation/navigation.types";
import {NavigationService} from "@organizo/services/navigation/navigation.service";
import {OrganizoMediaWatcherService} from "@organizo/services/media-watcher/media-watcher.service";
import {OrganizoConfig} from "@organizo/services/config/config.types";
import {OrganizoConfigService} from "@organizo/services/config/config.service";

@Component({
  selector: 'dense-layout',
  templateUrl: './dense.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [OrganizoLoadingBarComponent, OrganizoVerticalNavigationComponent, MatButtonModule, MatIconModule, OrganizoFullscreenComponent, NotificationsComponent, UserComponent, RouterOutlet, NgClass],
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
  config: OrganizoConfig;
  isScreenSmall: boolean;
  navigation: Navigation;
  navigationAppearance: 'default' | 'dense' = 'dense';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _navigationService: NavigationService,
    private _organizoMediaWatcherService: OrganizoMediaWatcherService,
    private _organizoConfigService: OrganizoConfigService,
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation data
    this._navigationService.navigation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((navigation: Navigation) => {
        this.navigation = navigation;
      });

    // Subscribe to media changes
    this._organizoMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({matchingAliases}) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');

        // Change the navigation appearance
        this.navigationAppearance = this.isScreenSmall ? 'default' : 'dense';
      });

    // Subscribe to config changes
    this._organizoConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: OrganizoConfig) => {
        // Store the config
        this.config = config;
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
   * Toggle navigation
   *
   * @param name
   */
  // toggleNavigation(name: string): void {
  //   // Get the navigation
  //   const navigation = this._organizoNavigationService.getComponent<OrganizoVerticalNavigationComponent>(name);
  //
  //   if (navigation) {
  //     // Toggle the opened status
  //     navigation.toggle();
  //   }
  // }
  //
  // /**
  //  * Toggle the navigation appearance
  //  */
  // toggleNavigationAppearance(): void {
  //   this.navigationAppearance = (this.navigationAppearance === 'default' ? 'dense' : 'default');
  // }
}
