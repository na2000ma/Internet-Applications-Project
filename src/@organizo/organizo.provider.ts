import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  Provider
} from '@angular/core';
import {MATERIAL_SANITY_CHECKS} from '@angular/material/core';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {ORGANIZO_CONFIG} from "@organizo/services/config/config.constants";
import {OrganizoConfig} from "@organizo/services/config/config.types";
import {organizoLoadingInterceptor} from "@organizo/interceptor/loading/loading.interceptor";
import {OrganizoMediaWatcherService} from "@organizo/services/media-watcher/media-watcher.service";
import {OrganizoPlatformService} from "@organizo/services/platform/platform.service";
import {OrganizoSplashScreenService} from "@organizo/services/splash-screen/splash-screen.service";
import {AppHttpInterceptor} from "@organizo/interceptor/auth/app-http-interceptor.interceptor";
import {TitleStrategy} from "@angular/router";
import {TitleStrategyService} from "@organizo/services/title-strategy/title-strategy.service";
import {IconsService} from "@app/services/icons.service";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {MatPaginatorIntlService} from "@organizo/services/mat-paginator-intl/mat-paginator-intl.service";
import {MAT_RADIO_DEFAULT_OPTIONS} from "@angular/material/radio";
import {AppService} from "@app/services/app.service";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {provideLottieOptions} from 'ngx-lottie';
import player from 'lottie-web';

function initApp(appService: AppService) {
  return () => appService.initApp();
}

/**
 * Organizo provider
 */
export const provideOrganizo = (config: OrganizoConfig): Array<Provider | EnvironmentProviders> => {
  // Return the base providers
  return [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: APP_INITIALIZER, useFactory: initApp, deps: [AppService], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true},
    provideHttpClient(withInterceptors([organizoLoadingInterceptor])),
    {provide: TitleStrategy, useClass: TitleStrategyService},
    // Disable 'close' in mat dialog
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {disableClose: true}},
    {
      // Disable 'theme' sanity check
      provide: MATERIAL_SANITY_CHECKS,
      useValue: {
        doctype: true,
        theme: false,
        version: true,
      },
    },
    {
      // Use the 'fill' appearance on Angular Material form fields by default
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      },
    },
    {
      // Use the 'primary' color on Angular Material radio fields by default
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: {
        color: 'primary'
      },
    },
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlService},
    {
      provide: ORGANIZO_CONFIG,
      useValue: config ?? {},
    },
    importProvidersFrom(MatDialogModule),
    // {
    //   provide: ENVIRONMENT_INITIALIZER,
    //   useValue: () => inject(OrganizoConfirmationService),
    //   multi: true,
    // },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(IconsService),
      multi: true,
    },
    // {
    //   provide: ENVIRONMENT_INITIALIZER,
    //   useValue: () => inject(OrganizoLoadingService),
    //   multi: true,
    // },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(OrganizoMediaWatcherService),
      multi: true,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(OrganizoPlatformService),
      multi: true,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(OrganizoSplashScreenService),
      multi: true,
    },
    provideLottieOptions({
      player: () => player,
    }),
    // {
    //   provide: ENVIRONMENT_INITIALIZER,
    //   useValue: () => inject(ObjectUtilsService),
    //   multi: true,
    // },
    // {
    //   provide: ENVIRONMENT_INITIALIZER,
    //   useValue: () => inject(StringUtilsService),
    //   multi: true,
    // },
    // {
    //   provide: ENVIRONMENT_INITIALIZER,
    //   useValue: () => inject(OrganizoUtilsService),
    //   multi: true,
    // },
  ];
};
