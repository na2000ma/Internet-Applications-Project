import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";

export class DispatchTaskForm extends BaseFormDef {

  constructor(private users ?: Array<any>) {
    super();

    this.fields = [
      FieldBuilder
        .radio()
        .key('status')
        .label('Select Status')
        .required(true)
        .options([
          {
            label: "Approve",
            value: true,
          },
          {
            label: 'Reject',
            value: false
          }
        ])
        .labelProp('label')
        .valueProp('value')
        .value(),
      FieldBuilder
        .multiCheckbox()
        .label('Users')
        .key('users')
        .options(users)
        .labelProp('fullName')
        .valueProp('loginName')
        .value(),
    ]
  }

}
