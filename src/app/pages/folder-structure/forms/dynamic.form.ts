import {BaseFormDef} from "@organizo/forms/models/base-form-def";


export class DynamicForm extends BaseFormDef {
  constructor(fields: any[] = []) {
    super();
    this.fields = fields;
  }
}
