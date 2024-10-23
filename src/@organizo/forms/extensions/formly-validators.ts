import {AbstractControl} from "@angular/forms";
import {isObservable, Observable} from "rxjs";
import {get} from "lodash-es";

export class FormlyValidators {

  static phoneNumberValidator(control: AbstractControl): boolean {
    const phoneRegex = /^(\+\d{1,2}\s?)?(\(\d{1,4}\)|\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})$/;
    return phoneRegex.test(control.value);
  }

  static confirmPasswordValidator(control: AbstractControl): boolean {
    return control.value === control.parent.get('newPassword').value;
  }

  static uniqueValidator(control: AbstractControl): boolean {

    const options: Array<any> | Observable<Array<any>> = get(control, '_fields.0.props.options');

    let data: Array<any>;
    if (isObservable(options)) {
      options.subscribe(option => data = option);
    } else {
      data = options;
    }

    let isValid: boolean = false;

    for (let option of data) {
      if (option === control.value) {
        return isValid = false
      } else {
        isValid = true;
      }
    }

    return isValid;
  }
}
