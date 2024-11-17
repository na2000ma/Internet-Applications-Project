import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {GroupsState} from "@app/pages/groups/store/groups.state";

export class AddGroupForm extends BaseFormDef {

  store = inject(Store);
  constructor() {
    super();

    this.fields = [
      FieldBuilder
        .text()
        .label('name')
        .key('name')
        .value(),
      FieldBuilder
        .multiSelect()
        .key('users')
        .labelProp('name')
        .valueProp( 'id')
        .options(this.store.select(GroupsState.users))
        .value()
    ]
  }
}
