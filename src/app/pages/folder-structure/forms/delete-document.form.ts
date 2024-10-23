import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";

export class DeleteDocumentForm extends BaseFormDef {

  constructor() {
    super();
    this.fields = [
      FieldBuilder
        .checkbox()
        .key('fromAllContainers')
        .label('folderStructure.fromAllContainers')
        .required()
        .defaultValue(false)
        .value()
    ]
  }
}
