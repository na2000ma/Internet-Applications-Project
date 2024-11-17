import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";

export class AddFolderForm extends BaseFormDef {

  constructor() {
    super();

    this.fields = [
      FieldBuilder
        .text()
        .key('name')
        .label('Name')
        .required()
        .value(),
      FieldBuilder
        .fileUploader()
        .key('path')
        .type('content')
        .required()
        .value()
    ]
  }
}
