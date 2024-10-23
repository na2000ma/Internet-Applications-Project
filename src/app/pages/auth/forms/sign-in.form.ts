import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";

export class SignInForm extends BaseFormDef {
  constructor() {
    super();

    this.fields = [
      FieldBuilder
        .text()
        .key('email')
        .label('activeDirectory.emailOrUsername')
        .required()
        .value(),
      FieldBuilder
        .password()
        .key('password')
        .label('users.password')
        .required()
        .value()
    ]
  }

}
