import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {GetTemplateByClassificationIdAction} from "@app/pages/folder-structure/store/folders/folders.actions";
import {SearchTemplateState} from "@app/pages/search-template/store/search-template.state";
import {map} from "rxjs";
import {get} from "lodash-es";
import {SetSearchPageTitleAction} from "@app/pages/search-template/store/search-template.actions";

export class ClassificationSearchForm extends BaseFormDef {
  constructor() {
    super();
    this.fields = [
      FieldBuilder
        .select()
        .key('classification')
        .label('folderStructure.classifications')
        .labelProp('name')
        .valueProp('objectId')
        .options(inject(Store).select(SearchTemplateState.classifications))
        .onInit(field => {
          const store = inject(Store);
          this.subs.add(
            field.formControl.valueChanges.subscribe(value => {
              this.subs.add(
                store.select(SearchTemplateState.classifications).pipe(
                  map(classifications => classifications.find(item => get(item, 'objectId') === value))
                ).subscribe(item => {
                  if (item) {
                    store.dispatch(new SetSearchPageTitleAction(get(item, 'searchPageName')))
                  }
                })
              )
              store.dispatch(new GetTemplateByClassificationIdAction({classificationId: value, templateType: 2}))
            })
          )
        })
        .onDestroy(() => this.subs.unsubscribe())
        .required()
        .value()
    ]
  }
}
