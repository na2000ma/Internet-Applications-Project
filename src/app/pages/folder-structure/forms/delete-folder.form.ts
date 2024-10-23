import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {set} from "lodash-es";
import {LayoutBuilder} from "@organizo/forms/form-builders/layoutBuilder";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";

export class DeleteFolderForm extends BaseFormDef {

  store = inject(Store);

  constructor() {
    super();
    this.fields = [
      LayoutBuilder.row(
        [
          FieldBuilder
            .checkbox()
            .label('folderStructure.moveToAnotherContainer')
            .key('moveToAnotherContainer')
            .defaultValue(false)
            .value(),
          FieldBuilder
            .select()
            .hideExp(true)
            .key('availableContainers')
            .options(this.store.select(FoldersState.availableContainers))
            .valueProp('objectId')
            .labelProp('name')
            .onInit(field => {
              if (field) {
                this.subs.add(
                  field.form.get('moveToAnotherContainer').valueChanges.subscribe(value => {
                    set(field, 'hideExpression', !value);
                  })
                )
              }
            })
            .onDestroy(() => this.subs.unsubscribe())
            .required()
            .value()
        ])
    ]

  }

}
