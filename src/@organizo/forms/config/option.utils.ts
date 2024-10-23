import {FormlyFieldConfig} from "@ngx-formly/core";
import {get} from "lodash-es";

export function showErrorOption(field: FormlyFieldConfig) {
  return (
      get(field, 'options.formState.submitted') ||
      get(field, 'options.parentForm.submitted') ||
      get(field, 'formControl.touched') ||
      get(field, 'validation.show')
    ) && !get(field, 'formControl.valid')
    && !get(field, 'formControl.disabled');
}
