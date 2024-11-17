import {ConfigOption} from "@ngx-formly/core";
import {AddonsFormlyWrapperComponent} from "@organizo/forms/components/wrappers/addons-formly-wrapper.component";
import {FormlyFieldInput} from "@ngx-formly/material/input";
import {FormlyFieldDatepicker} from "@ngx-formly/material/datepicker";
import {FormlyFieldCheckbox} from "@ngx-formly/material/checkbox";
import {FormlyFieldMultiCheckbox} from "@ngx-formly/material/multicheckbox";
import {FormlyFieldRadio} from "@ngx-formly/material/radio";
import {FormlyFieldSelect} from "@ngx-formly/material/select";
import {FormlyFieldSlider} from "@ngx-formly/material/slider";
import {FormlyFieldToggle} from "@ngx-formly/material/toggle";
import {FormlyFieldTextArea} from "@ngx-formly/material/textarea";
import {FieldTypes} from "@organizo/forms/types/field-types";
import {
  FileUploaderFieldComponent
} from "@organizo/forms/components/fields/file-uploader-field/file-uploader-field.component";
import {ColumnWrapperComponent} from "@organizo/forms/components/wrappers/column-wrapper/column-wrapper.component";
import {RowWrapperComponent} from "@organizo/forms/components/wrappers/row-wrapper/row-wrapper.component";
import {WrapperTypes} from "@organizo/forms/types/wrapper-types";


export const appFormlyConfig: ConfigOption = {
  types: [
    // Input
    {name: FieldTypes.Input, component: FormlyFieldInput},
    {
      name: FieldTypes.Email, extends: FieldTypes.Input, defaultOptions: {
        validators: {validation: ['email']},
        props: {attributes: {autocomplete: 'email'}}
      }
    },
    {
      name: FieldTypes.UniqueInput, extends: FieldTypes.Input, defaultOptions: {
        validators: {validation: ['unique']},
      }
    },
    {
      name: FieldTypes.PhoneNumber, extends: FieldTypes.Input, defaultOptions: {
        validators: {validation: ['phoneNumber']}
      }
    },
    {
      name: FieldTypes.Password, extends: FieldTypes.Input, defaultOptions: {
        props: {
          attributes: {autocomplete: 'password'},
          type: FieldTypes.Password,
          addonRight: {
            icon: 'visibility',
            onClick: (event: any) => {
              if (event.type === 'password') {
                event.type = 'text'
                event.addonRight.icon = 'visibility_off';
              } else {
                event.type = 'password'
                event.addonRight.icon = 'visibility';
              }
            }
          }
        },
      }
    },
    {name: FieldTypes.Number, extends: FieldTypes.Input, defaultOptions: {props: {type: FieldTypes.Number}}},
    // Datepicker
    {name: FieldTypes.DatePicker, component: FormlyFieldDatepicker},
    // Checkbox
    {name: FieldTypes.Checkbox, component: FormlyFieldCheckbox},
    // MultiCheckbox
    {name: FieldTypes.MultiCheckbox, component: FormlyFieldMultiCheckbox, wrappers: ['form-field']},
    // Radio
    {name: FieldTypes.Radio, component: FormlyFieldRadio},
    // Select
    {name: FieldTypes.Select, component: FormlyFieldSelect},
    {name: FieldTypes.MultiSelect, extends: FieldTypes.Select, defaultOptions: {props: {multiple: true}}},
    // Slider
    {name: FieldTypes.Slider, component: FormlyFieldSlider},
    // Textarea
    {name: FieldTypes.Textarea, component: FormlyFieldTextArea, defaultOptions: {props: {rows: 5, cols: 500}}},
    // Toggle
    {name: FieldTypes.Toggle, component: FormlyFieldToggle},

    // Custom Fields
    {name: FieldTypes.FileUploader, component: FileUploaderFieldComponent},

  ],
  wrappers: [
    // {name: 'form-field', component: FormlyWrapperFormField},
    {name: 'addons', component: AddonsFormlyWrapperComponent},
    {name: WrapperTypes.Column, component: ColumnWrapperComponent},
    {name: WrapperTypes.Row, component: RowWrapperComponent}
  ],
  // extras: {showError: showErrorOption}
};
