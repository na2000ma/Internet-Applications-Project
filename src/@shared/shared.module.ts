import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {UnsubscribeComponent} from './components/unsubscribe/unsubscribe.component';
import {environment} from "@env/environment";


function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, `${environment.base}assets/i18n/`, '.json');
}

@NgModule({
  declarations: [
    UnsubscribeComponent
  ],
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('userLang') || 'en_UK',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    HttpClientModule,
    TranslateModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class SharedModule {
  constructor() {
  }
}
