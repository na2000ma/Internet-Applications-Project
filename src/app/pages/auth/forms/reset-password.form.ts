import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";

export class ResetPasswordForm extends BaseFormDef {
  constructor() {
    super();
    this.fields = [
      FieldBuilder
        .password()
        .key('newPassword')
        .label('auth.newPassword')
        .required()
        .value(),
      FieldBuilder
        .password()
        .key('confirmPassword')
        .label('auth.newPasswordConfirmation')
        .required()
        .validators({validation: ['confirmPassword']})
        .value(),
    ]
  }

}
