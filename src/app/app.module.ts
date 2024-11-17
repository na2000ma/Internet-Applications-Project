import {Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NgxsModule} from "@ngxs/store";
import {SharedModule} from "@shared/shared.module";
import {setAppInjector} from "@organizo/injector/app-injector";
import {appProvidersConfig} from "@app/app-providers.config";
import {AppState} from "@app/store/app.state";
import {AuthState} from "@app/pages/auth/store/auth.state";
import {CommonModule} from '@angular/common';
import {provideNativeDateAdapter} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    NgxsModule.forRoot([
      AppState,
      AuthState
    ])
  ],
  providers: [appProvidersConfig, provideNativeDateAdapter()],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
