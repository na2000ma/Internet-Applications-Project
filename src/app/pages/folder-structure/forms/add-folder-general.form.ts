import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {LayoutBuilder} from "@organizo/forms/form-builders/layoutBuilder";
import {
  GetRelatedFieldsAction,
  GetTemplateByClassificationIdAction
} from "@app/pages/folder-structure/store/folders/folders.actions";
import {get} from "lodash-es";
import {
  GetClassSecurityTemplateByIdAction,
  SetDefaultInstanceSecurityIdAction
} from "@app/pages/security-template/store/class-security.action";
import {ActivatedRoute, Router} from "@angular/router";
import {lastValueFrom} from "rxjs";

export class AddFolderGeneralForm extends BaseFormDef {

  store = inject(Store);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  constructor(forRename: boolean = false) {
    super();
    this.fields = [
      LayoutBuilder.row([
        FieldBuilder
          .select()
          .key('classification')
          .label('folderStructure.classifications')
          .labelProp('className')
          .valueProp('objectId')
          .options(inject(Store).select(DocumentsState.availableClassificationsForFolder))
          .onInit(field => {
            this.subs.add(
              field.formControl.valueChanges.subscribe(async value => {
                this.store.dispatch([
                  new GetTemplateByClassificationIdAction({classificationId: value, templateType: 1}),
                  new GetRelatedFieldsAction(value)
                ])
                const classification = this.store.selectSnapshot(DocumentsState.availableClassificationsForFolder).find((dc: any) => get(dc, 'objectId') === value);
                if (get(classification, 'defaultInstanceSecurityId')) {
                  this.store.dispatch(new GetClassSecurityTemplateByIdAction(get(classification, 'defaultInstanceSecurityId'), true))
                }
                await lastValueFrom(this.store.dispatch(new SetDefaultInstanceSecurityIdAction(get(classification, 'defaultInstanceSecurityId'))))
              })
            )
          })
          .onDestroy(() => this.subs.unsubscribe())
          .hideExp(forRename)
          .required()
          .value(),
        FieldBuilder
          .select()
          .key('availableDocumentClass')
          .label('folderStructure.availableDocumentClasses')
          .labelProp('className')
          .valueProp('objectId')
          .options(inject(Store).select(DocumentsState.availableDocumentClasses))
          .hideExp(forRename)
          .required()
          .value(),
      ]),
      FieldBuilder
        .text()
        .key('name')
        .label('folderStructure.name')
        .required()
        .value()
    ]
  }
}
