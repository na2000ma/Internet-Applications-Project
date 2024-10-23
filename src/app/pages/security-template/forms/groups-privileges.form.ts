import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {map, Observable} from "rxjs";
import {get, set} from "lodash-es";

export class GroupsPrivilegesForm extends BaseFormDef {

  constructor(groups$: Observable<Array<any>>) {
    super();
    this.fields = [
      FieldBuilder
        .text()
        .key('search')
        .placeholder('Search On Groups')
        .value(),
      FieldBuilder
        .multiCheckbox()
        .label('Select one or more group/s')
        .key('groups')
        .labelProp('name')
        .valueProp('sid')
        .options(groups$)
        .onInit(field => {
          field.form.get('search').valueChanges.subscribe(value => {
            if (value !== undefined) {
              if (value.length === 0) {
                set(field, 'props.options', groups$);
                return;
              }
              let groups = groups$.pipe(
                map(
                  (groups: any[]) => groups.filter(group => (get(group, 'name') + '').toUpperCase().startsWith(value.toUpperCase()))
                )
              )
              set(field, 'props.options', groups);
            }
          })
        })
        .value()
    ]
  }
}
