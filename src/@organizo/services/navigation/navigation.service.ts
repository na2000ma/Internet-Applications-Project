import {HttpClient} from '@angular/common/http';
import {inject, Injectable, OnDestroy} from '@angular/core';
import {Observable, ReplaySubject, Subject, takeUntil, tap} from 'rxjs';
import {cloneDeep} from "lodash-es";
import {OrganizoConfigService} from "@organizo/services/config/config.service";
import {OrganizoConfig} from "@organizo/services/config/config.types";
import {Navigation} from "@organizo/services/navigation/navigation.types";

@Injectable({providedIn: 'root'})
export class NavigationService implements OnDestroy {

  private _httpClient = inject(HttpClient);
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
  private _navigationItems: Navigation;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _organizoConfigService: OrganizoConfigService) {

    // Subscribe to config changes
    this._organizoConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: OrganizoConfig) => {
        // Set navigation items
        const _compactNavigation = config.navigationItems.compact;
        const _defaultNavigation = config.navigationItems.default;
        const _futuristicNavigation = config.navigationItems.futuristic;
        const _horizontalNavigation = config.navigationItems.horizontal;

        // Fill compact navigation children using the default navigation
        _compactNavigation.forEach((compactNavItem) => {
          _defaultNavigation.forEach((defaultNavItem) => {
            if (defaultNavItem.id === compactNavItem.id) {
              compactNavItem.children = cloneDeep(defaultNavItem.children);
            }
          });
        });

        // Fill futuristic navigation children using the default navigation
        _futuristicNavigation.forEach((futuristicNavItem) => {
          _defaultNavigation.forEach((defaultNavItem) => {
            if (defaultNavItem.id === futuristicNavItem.id) {
              futuristicNavItem.children = cloneDeep(defaultNavItem.children);
            }
          });
        });

        // Fill horizontal navigation children using the default navigation
        _horizontalNavigation.forEach((horizontalNavItem) => {
          _defaultNavigation.forEach((defaultNavItem) => {
            if (defaultNavItem.id === horizontalNavItem.id) {
              horizontalNavItem.children = cloneDeep(defaultNavItem.children);
            }
          });
        });

        this._navigationItems = {
          default: cloneDeep(_defaultNavigation),
          compact: cloneDeep(_compactNavigation),
          futuristic: cloneDeep(_futuristicNavigation),
          horizontal: cloneDeep(_horizontalNavigation),
        };

        this._navigation.next(this._navigationItems);
      })
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    // return of(this._navigationItems);
    return this._navigation.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all navigation data
   */
  get(): Observable<Navigation> {
    return this._httpClient.get<Navigation>('api/common/navigation').pipe(
      tap((navigation) => {
        this._navigation.next(navigation);
      }),
    );
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
