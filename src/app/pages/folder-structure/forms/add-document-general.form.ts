import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {SetGeneralFormValue} from "@app/pages/folder-structure/store/documents/documents.actions";
import {GetTemplateByClassificationIdAction} from "@app/pages/folder-structure/store/folders/folders.actions";
import {get} from "lodash-es";
import {
  GetClassSecurityTemplateByIdAction,
  SetDefaultInstanceSecurityIdAction
} from "@app/pages/security-template/store/class-security.action";
import {lastValueFrom} from "rxjs";

export class AddDocumentGeneralForm extends BaseFormDef {

  store = inject(Store);

  constructor(forCheckin: boolean = false, forEdit: boolean = false) {
    super();
    this.fields = [
      FieldBuilder
        .select()
        .key('classification')
        .label('folderStructure.classifications')
        .labelProp('className')
        .valueProp('objectId')
        .hideExp(forCheckin || forEdit)
        .options(inject(Store).select(DocumentsState.availableClassificationsForDocument))
        .onInit(field => {
          if (field) {
            this.subs.add(
              field.formControl.valueChanges.subscribe(async value => {
                this.store.dispatch(new GetTemplateByClassificationIdAction({classificationId: value, templateType: 1}))
                this.store.dispatch(new SetGeneralFormValue(value))
                const classification = this.store.selectSnapshot(DocumentsState.availableClassificationsForDocument).find((dc: any) => get(dc, 'objectId') === value);
                if (get(classification, 'defaultInstanceSecurityId')) {
                  this.store.dispatch(new GetClassSecurityTemplateByIdAction(get(classification, 'defaultInstanceSecurityId'), true))
                }
                await lastValueFrom(this.store.dispatch(new SetDefaultInstanceSecurityIdAction(get(classification, 'defaultInstanceSecurityId'))))
              })
            )
          }
        })
        .onDestroy(() => this.subs.unsubscribe())
        .required()
        .value(),
      FieldBuilder
        .text()
        .key('title')
        .label('folderStructure.title')
        .hideExp(forCheckin)
        .required()
        .onInit(field => {
          const store = inject(Store);
          this.subs.add(
            field.formControl.valueChanges.subscribe(value => store.dispatch(new SetGeneralFormValue(value)))
          )
        })
        .onDestroy(() => this.subs.unsubscribe())
        .value(),
      FieldBuilder
        .fileUploader()
        .key('content')
        .type('content')
        .hideExp(forEdit)
        .required()
        .onInit(field => {
          const store = inject(Store);
          this.subs.add(
            field.formControl.valueChanges.subscribe(value => store.dispatch(new SetGeneralFormValue(value)))
          )
        })
        .onDestroy(() => this.subs.unsubscribe())
        .value()
    ]
  }
}
