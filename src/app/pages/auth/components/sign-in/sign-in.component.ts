import {Component, ViewEncapsulation} from '@angular/core';
import {SignInForm} from "@app/pages/auth/forms/sign-in.form";
import {Store} from "@ngxs/store";
import {GetLoginAction} from "@app/pages/auth/store/auth.action";
import {SharedModule} from "@shared/shared.module";
import {AppFormsModule} from "@organizo/forms/app-forms.module";
import {RouterLink} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";


@Component({
  selector: 'sign-in-reset-password',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [SharedModule, AppFormsModule, RouterLink, MatProgressSpinner, MatIcon, MatButton],
})
export class AuthSignInComponent extends UnsubscribeComponent {

  formDef: SignInForm = new SignInForm();

  constructor(
    private store: Store) {
    super();
  }

  submit(model: any) {
    this.formDef.group.disable();
    this.subscriptions.add(
      this.store.dispatch(new GetLoginAction(model)).subscribe({
        complete: () => {
          this.formDef.group.enable();
        }
      })
    )
  }
}
