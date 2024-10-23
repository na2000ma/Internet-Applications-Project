import {FieldTypes} from "@organizo/forms/types/field-types";
import {BaseFormField} from "@organizo/forms/models/base-form-field";

export class FieldBuilder {

  static hidden(): BaseFormField {
    return new BaseFormField();
  }

  static text(): BaseFormField {
    return new BaseFormField(FieldTypes.Input);
  }

  static email(): BaseFormField {
    return new BaseFormField(FieldTypes.Email);
  }

  static uniqueInput(): BaseFormField {
    return new BaseFormField(FieldTypes.UniqueInput);
  }

  static phoneNumber(): BaseFormField {
    return new BaseFormField(FieldTypes.PhoneNumber);
  }

  static password(): BaseFormField {
    return new BaseFormField(FieldTypes.Password);
  }

  static number(): BaseFormField {
    return new BaseFormField(FieldTypes.Number);
  }

  static textarea(): BaseFormField {
    return new BaseFormField(FieldTypes.Textarea);
  }

  static date(): BaseFormField {
    return new BaseFormField(FieldTypes.DatePicker);
  }

  static checkbox(): BaseFormField {
    return new BaseFormField(FieldTypes.Checkbox);
  }

  static multiCheckbox(): BaseFormField {
    return new BaseFormField(FieldTypes.MultiCheckbox);
  }

  static radio(): BaseFormField {
    return new BaseFormField(FieldTypes.Radio);
  }

  static select(): BaseFormField {
    return new BaseFormField(FieldTypes.Select);
  }

  static multiSelect(): BaseFormField {
    return new BaseFormField(FieldTypes.MultiSelect);
  }

  static toggle(): BaseFormField {
    return new BaseFormField(FieldTypes.Toggle);
  }

  static repeatSection(): BaseFormField {
    return new BaseFormField(FieldTypes.RepeatSection);
  }

  static stepper(): BaseFormField {
    return new BaseFormField(FieldTypes.Stepper);
  }

  static fileUploader(): BaseFormField {
    return new BaseFormField(FieldTypes.FileUploader);
  }

  static dragDrop(): BaseFormField {
    return new BaseFormField(FieldTypes.DragDrop);
  }

  static searchableSelect(): BaseFormField {
    return new BaseFormField(FieldTypes.SearchableSelect);
  }

  static tree(): BaseFormField {
    return new BaseFormField(FieldTypes.Tree);
  }

  // static uploadContent(): BaseFormField {
  //   return new BaseFormField(FieldTypes.UploadContent);
  // }
  //
  // static dragDrop(): BaseFormField {
  //   return new BaseFormField(FieldTypes.DragDrop);
  // }
}
