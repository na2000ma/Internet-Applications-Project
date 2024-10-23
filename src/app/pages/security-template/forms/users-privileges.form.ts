import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {map, Observable} from "rxjs";
import {get, set} from "lodash-es";


export class UsersPrivilegesForm extends BaseFormDef {


  constructor(users$: Observable<Array<any>>) {
    super();
    this.fields = [
      FieldBuilder
        .text()
        .key('search')
        .placeholder('Search On Users')
        .value(),
      FieldBuilder
        .multiCheckbox()
        .label('Select one or more user/s')
        .key('users')
        .labelProp('loginName')
        .valueProp('sid')
        .options(users$)
        .onInit(field => {
          field.form.get('search').valueChanges.subscribe(value => {
            if (value !== undefined) {
              if (value.length === 0) {
                set(field, 'props.options', users$);
                return;
              }
              let users = users$.pipe(
                map(
                  (users: any[]) => users.filter(user => (get(user, 'loginName') + '').toUpperCase().startsWith(value.toUpperCase()))
                )
              )

              set(field, 'props.options', users);
            }
          })
        })
        .value()
    ]
  }
}
