import {DOCUMENT} from '@angular/common';
import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {combineLatest, filter, map, Subject, takeUntil} from 'rxjs';
import {EmptyLayoutComponent} from './layouts/empty/empty.component';
import {DenseLayoutComponent} from './layouts/vertical/dense/dense.component';
import {OrganizoConfig} from "@organizo/services/config/config.types";
import {OrganizoConfigService} from "@organizo/services/config/config.service";
import {OrganizoMediaWatcherService} from "@organizo/services/media-watcher/media-watcher.service";
import {OrganizoPlatformService} from "@organizo/services/platform/platform.service";
import {ORGANIZO_VERSION} from "@version/organizo-version";

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [EmptyLayoutComponent, DenseLayoutComponent],
})
export class LayoutComponent implements OnInit, OnDestroy {
  config: OrganizoConfig;
  layout: string;
  scheme: 'dark' | 'light';
  theme: string;
  inAuthPage: boolean;
  inCreateOrganizationPage: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
    private cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _router: Router,
    private _organizoConfigService: OrganizoConfigService,
    private _organizoMediaWatcherService: OrganizoMediaWatcherService,
    private _organizoPlatformService: OrganizoPlatformService,
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the layout from local storage when I refresh the page
    if (!this._activatedRoute.snapshot.queryParams['layout']) {
      this.layout = localStorage.getItem('organizo-layout')
      this._router.navigate(
        [],
        {
          relativeTo: this._activatedRoute,
          queryParams: {
            layout: this.layout
          },
          queryParamsHandling: "merge"
        }
      )
    }

    //Get the layout from the query param
    this._activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params['layout']) {
          this.layout = params['layout']
        }
      }
    )

    // Set the theme and scheme based on the configuration
    combineLatest([
      this._organizoConfigService.config$,
      this._organizoMediaWatcherService.onMediaQueryChange$(['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)']),
    ]).pipe(
      takeUntil(this._unsubscribeAll),
      map(([config, mql]) => {
        const options = {
          scheme: config.scheme,
          theme: config.theme,
        };

        // If the scheme is set to 'auto'...
        if (config.scheme === 'auto') {
          // Decide the scheme using the media query
          options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
        }
        return options;
      }),
    ).subscribe((options) => {
      // Store the options
      this.scheme = options.scheme;
      this.theme = options.theme;

      // Update the scheme and theme
      this._updateScheme();
      this._updateTheme();
    });

    // Subscribe to config changes
    this._organizoConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: OrganizoConfig) => {
        // Store the config
        this.config = config;

        // Update the layout
        this._updateLayout();
      });

    // Subscribe to NavigationEnd event
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll),
    ).subscribe(() => {
      // Update the layout
      this._updateLayout();
    });

    // Set the app version
    this._renderer2.setAttribute(this._document.querySelector('[ng-version]'), 'organizo-version', ORGANIZO_VERSION);

    // Set the OS name
    this._renderer2.addClass(this._document.body, this._organizoPlatformService.osName);
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
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  getColorPropertyValue(name: string) {
    return (getComputedStyle(this._document.body).getPropertyValue(name) || '#').substring(1);
  }

  /**
   * Update the selected layout
   */
  private _updateLayout(): void {
    this.inAuthPage = !!this._router.url.startsWith('/auth');
    this.inCreateOrganizationPage = !!this._router.url.startsWith('/create-organization');
  }

  /**
   * Update the selected scheme
   *
   * @private
   */
  private _updateScheme(): void {
    // Remove class names for all schemes
    this._document.body.classList.remove('light', 'dark');

    // Add class name for the currently selected scheme
    this._document.body.classList.add(this.scheme);
  }

  /**
   * Update the selected theme
   *
   * @private
   */
  private _updateTheme(): void {
    // Find the class name for the previously selected theme and remove it
    this._document.body.classList.forEach((className: string) => {
      if (className.startsWith('theme-')) {
        this._document.body.classList.remove(className, className.split('-')[1]);
      }
    });

    // Add class name for the currently selected theme
    this._document.body.classList.add(this.theme);
    // this.updateFavicon();
  }

  // private updateFavicon() {
  //   const favicon = this._document.getElementById('favicon');
  //   // Get favicon as data uri and set color to variables in style tag, see favicon.svg
  //   favicon.href = `data:image/svg+xml,%3Csvg width='128' height='128' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E * %7B --organizo-primary: %23${this.getColorPropertyValue('--organizo-primary')}; --organizo-primary-100: %23${this.getColorPropertyValue('--organizo-primary-100')}; --organizo-primary-200: %23${this.getColorPropertyValue('--organizo-primary-200')}; --organizo-primary-300: %23${this.getColorPropertyValue('--organizo-primary-300')}; --organizo-primary-400: %23${this.getColorPropertyValue('--organizo-primary-400')}; --organizo-text-default: %23${this.getColorPropertyValue('--organizo-text-default')}; --organizo-bg-default: %23${this.getColorPropertyValue('--organizo-bg-default')}; %7D %3C/style%3E%3Crect width='24' height='24' rx='12' fill='var(--organizo-bg-default)'/%3E%3Cg clip-path='url(%23clip0_179_43)'%3E%3Cpath d='M13.5717 9.16666H10.4289C9.73198 9.16666 9.16699 9.73164 9.16699 10.4286V13.5714C9.16699 14.2683 9.73198 14.8333 10.4289 14.8333H13.5717C14.2687 14.8333 14.8337 14.2683 14.8337 13.5714V10.4286C14.8337 9.73164 14.2687 9.16666 13.5717 9.16666Z' fill='var(--organizo-primary)'/%3E%3Cpath d='M8.45534 14.9964C8.75797 14.9964 9.00355 15.2428 9.00355 15.5446V19.0803C9.00355 19.3829 8.75718 19.6286 8.45534 19.6286H4.91966C4.61703 19.6286 4.37145 19.3821 4.37145 19.0803V15.5446C4.37145 15.242 4.61782 14.9964 4.91966 14.9964H8.45534ZM8.45534 14.125H4.91966C4.13536 14.125 3.5 14.7603 3.5 15.5446V19.0803C3.5 19.8646 4.13536 20.5 4.91966 20.5H8.45534C9.23964 20.5 9.875 19.8646 9.875 19.0803V15.5446C9.875 14.7603 9.23964 14.125 8.45534 14.125Z' fill='var(--organizo-primary)'/%3E%3Cpath d='M8.45534 3.5H4.91966C4.1356 3.5 3.5 4.1356 3.5 4.91966V8.45534C3.5 9.2394 4.1356 9.875 4.91966 9.875H8.45534C9.23939 9.875 9.875 9.2394 9.875 8.45534V4.91966C9.875 4.1356 9.23939 3.5 8.45534 3.5Z' fill='var(--organizo-text-default)'/%3E%3Cmask id='mask0_179_43' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='14' y='3' width='7' height='7'%3E%3Cpath d='M19.0803 3.5H15.5446C14.7605 3.5 14.125 4.1356 14.125 4.91966V8.45534C14.125 9.2394 14.7605 9.875 15.5446 9.875H19.0803C19.8644 9.875 20.5 9.2394 20.5 8.45534V4.91966C20.5 4.1356 19.8644 3.5 19.0803 3.5Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_179_43)'%3E%3Cpath d='M15.719 8.28177H14.125V9.87571H15.719V8.28177Z' fill='var(--organizo-primary-400)'/%3E%3Cpath d='M17.3127 8.28177H15.7188V9.87571H17.3127V8.28177Z' fill='var(--organizo-primary)'/%3E%3Cpath d='M18.9065 8.28177H17.3125V9.87571H18.9065V8.28177Z' fill='var(--organizo-primary-400)'/%3E%3Cpath d='M20.5012 8.28177H18.9072V9.87571H20.5012V8.28177Z' fill='var(--organizo-primary-300)'/%3E%3Cpath d='M15.719 6.68799H14.125V8.28193H15.719V6.68799Z' fill='var(--organizo-primary)'/%3E%3Cpath d='M17.3127 6.68799H15.7188V8.28193H17.3127V6.68799Z' fill='var(--organizo-primary-300)'/%3E%3Cpath d='M18.9065 6.68799H17.3125V8.28193H18.9065V6.68799Z' fill='var(--organizo-primary)'/%3E%3Cpath d='M20.5012 6.68799H18.9072V8.28193H20.5012V6.68799Z' fill='var(--organizo-primary-400)'/%3E%3Cpath d='M15.719 5.09381H14.125V6.68776H15.719V5.09381Z' fill='var(--organizo-primary-400)'/%3E%3Cpath d='M17.3127 5.09381H15.7188V6.68776H17.3127V5.09381Z' fill='var(--organizo-primary)'/%3E%3Cpath d='M18.9065 5.09381H17.3125V6.68776H18.9065V5.09381Z' fill='var(--organizo-primary-400)'/%3E%3Cpath d='M20.5012 5.09381H18.9072V6.68776H20.5012V5.09381Z' fill='var(--organizo-primary-100)'/%3E%3Cpath d='M15.719 3.5H14.125V5.09395H15.719V3.5Z' fill='var(--organizo-primary)'/%3E%3Cpath d='M17.3127 3.5H15.7188V5.09395H17.3127V3.5Z' fill='var(--organizo-primary-400)'/%3E%3Cpath d='M18.9065 3.5H17.3125V5.09395H18.9065V3.5Z' fill='var(--organizo-primary-300)'/%3E%3Cpath d='M20.5012 3.5H18.9072V5.09395H20.5012V3.5Z' fill='var(--organizo-primary-200)'/%3E%3C/g%3E%3Cmask id='mask1_179_43' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='14' y='14' width='7' height='7'%3E%3Cpath d='M19.0803 14.125H15.5446C14.7605 14.125 14.125 14.7606 14.125 15.5446V19.0803C14.125 19.8644 14.7605 20.5 15.5446 20.5H19.0803C19.8644 20.5 20.5 19.8644 20.5 19.0803V15.5446C20.5 14.7606 19.8644 14.125 19.0803 14.125Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask1_179_43)'%3E%3Cpath d='M15.719 18.9067H14.125V20.5007H15.719V18.9067Z' fill='%234F4C4D'/%3E%3Cpath d='M17.3127 18.9067H15.7188V20.5007H17.3127V18.9067Z' fill='%237B7979'/%3E%3Cpath d='M15.719 17.313H14.125V18.9069H15.719V17.313Z' fill='var(--organizo-text-default)'/%3E%3Cpath d='M17.3127 17.313H15.7188V18.9069H17.3127V17.313Z' fill='%234F4C4D'/%3E%3Cpath d='M18.9065 17.313H17.3125V18.9069H18.9065V17.313Z' fill='%237B7979'/%3E%3Cpath d='M15.719 15.7188H14.125V17.3128H15.719V15.7188Z' fill='var(--organizo-text-default)'/%3E%3Cpath d='M18.9065 15.7188H17.3125V17.3128H18.9065V15.7188Z' fill='%234F4C4D'/%3E%3Cpath d='M17.3127 15.7188H15.7188V17.3128H17.3127V15.7188Z' fill='var(--organizo-text-default)'/%3E%3Cpath d='M20.5012 15.7188H18.9072V17.3128H20.5012V15.7188Z' fill='%237B7979'/%3E%3Cpath d='M15.719 14.125H14.125V15.7189H15.719V14.125Z' fill='var(--organizo-text-default)'/%3E%3Cpath d='M17.3127 14.125H15.7188V15.7189H17.3127V14.125Z' fill='var(--organizo-text-default)'/%3E%3Cpath d='M18.9065 14.125H17.3125V15.7189H18.9065V14.125Z' fill='var(--organizo-text-default)'/%3E%3Cpath d='M20.5012 14.125H18.9072V15.7189H20.5012V14.125Z' fill='%234F4C4D'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_179_43'%3E%3Crect width='17' height='17' fill='white' transform='translate(3.5 3.5)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A`
  // }
}
