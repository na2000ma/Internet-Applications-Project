import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";

export class WorkFlowForm extends BaseFormDef{

  constructor(private users ?: Array<any>) {
    super();

    this.fields = [
      FieldBuilder
        .textarea()
        .key('content')
        .label('Content')
        .required(true)
        .value(),
      FieldBuilder
        .multiCheckbox()
        .label('Secretary')
        .key('secretary')
        .required(true)
        .options(users)
        .labelProp('fullName')
        .valueProp('loginName')
        .value(),
      FieldBuilder
        .multiCheckbox()
        .label('Users')
        .key('users')
        .required(true)
        .options(users)
        .labelProp('fullName')
        .valueProp('loginName')
        .value(),
    ]
  }

}
