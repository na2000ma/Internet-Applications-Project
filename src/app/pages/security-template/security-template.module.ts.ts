import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SecurityClassState} from './store/class-security.state';



@NgModule({
  declarations: [],
  imports: [
    NgxsModule.forRoot([
      SecurityClassState
    ])
  ],
  providers: []
})
export class SecurityTemplateModule {
}
