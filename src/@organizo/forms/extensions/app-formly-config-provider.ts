import {TranslateService} from "@ngx-translate/core";
import {Validators} from "@angular/forms";
import {translateExtension} from "@organizo/forms/extensions/translate-extension";
import {addonsExtension} from "@organizo/forms/extensions/addons-extension";
import {FormlyValidators} from "@organizo/forms/extensions/formly-validators";

export function appFormlyConfigProvider(translate: TranslateService) {
  return {
    extensions: [
      {name: 'translate', extension: {prePopulate: translateExtension}}, {
        name: 'addons',
        extension: {onPopulate: addonsExtension}
      }],
    validators: [
      {name: 'email', validation: Validators.email},
      {name: 'phoneNumber', validation: FormlyValidators.phoneNumberValidator},
      {name: 'confirmPassword', validation: FormlyValidators.confirmPasswordValidator},
      {name: 'unique', validation: FormlyValidators.uniqueValidator}
    ],
    validationMessages: [
      {
        name: 'email', message(err: any, field: any) {
          return translate.stream('validations.email');
        },
      },
      {
        name: 'required', message(err: any, field: any) {
          return translate.stream('validations.required');
        },
      },
      {
        name: 'min', message(err: any, field: any) {
          return translate.stream('validations.min', {value: field.props.min});
        },
      },
      {
        name: 'max', message(err: any, field: any) {
          return translate.stream('validations.max', {value: field.props.max});
        },
      },
      {
        name: 'minLength', message(err: any, field: any) {
          return translate.stream('validations.minLength', {value: field.props.minLength});
        },
      },
      {
        name: 'maxLength', message(err: any, field: any) {
          return translate.stream('validations.maxLength', {value: field.props.maxLength});
        },
      },
      {
        name: 'pattern', message(err: any, field: any) {
          return translate.stream('validations.pattern');
        },
      },
      {
        name: 'phoneNumber', message(err: any, field: any) {
          return translate.stream('validations.phoneNumber');
        },
      },
      {
        name: 'confirmPassword', message(err: any, field: any) {
          return translate.stream('validations.confirmPassword');
        },
      },
      {
        name: 'unique', message(err: any, field: any) {
          return translate.stream('validations.unique');
        },
      }
    ]
  };
}

