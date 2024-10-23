import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {Store} from "@ngxs/store";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {AppFormsModule} from "@organizo/forms/app-forms.module";
import {DynamicForm} from "@app/pages/folder-structure/forms/dynamic.form";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {asapScheduler, Observable, tap} from "rxjs";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {get, set} from "lodash-es";
import {FolderStructureService} from "@app/pages/folder-structure/services/folder-structure.service";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {ShowFailedToast} from "@app/store/app.action";
import {DynamicTree} from "@app/pages/folder-structure/trees/dynamic.tree";
import {SetArrayByKey} from "@app/pages/folder-structure/store/folders/folders.actions";


@Component({
  selector: 'organizo-folder-document-properties',
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
  imports: [
    AppFormsModule
  ],
  standalone: true
})
export class PropertiesComponent extends UnsubscribeComponent implements AfterViewInit {
  @Input('inFolder') inFolder: boolean;

  dynamicForm: DynamicForm = new DynamicForm();

  @Output('form') onFormGroupChange = new EventEmitter<DynamicForm>;


  constructor(
    private store: Store,
    private folderStructureService: FolderStructureService
  ) {
    super();
    this.onFormGroupChange.emit(this.dynamicForm);


    this.subscriptions.add(
      this.store.select(FoldersState.template).subscribe(data => {
        if (data) {
          const {template, relatedList} = data;
          if (template && template.length > 0) {
            let templateRef = template.slice();
            this.dynamicForm = new DynamicForm(templateRef);

            (relatedList || []).forEach((relation: any) => {
              const {isTree, relatedPropertiesKey, propertiesKey, choiceListId} = relation;
              // hasTree
              if (!!isTree) {
                this.setDynamicTreeConfig(templateRef, relatedPropertiesKey, choiceListId)
              } else {
                // Get parents options
                this.folderStructureService.getChoiceListsByParentId(choiceListId).pipe(
                  tap((response: AppHttpResponse) => {
                    response.handle((data: any) => {
                        const newData = this.customizeTreeDataSource(data);
                        templateRef = this.setDataByKey(templateRef, relatedPropertiesKey, {
                          key: 'props.options',
                          value: newData
                        })

                        // Get children options on parent value change
                        this.dynamicForm.group.get(relatedPropertiesKey).valueChanges.subscribe(data => {
                          if (data) {
                            this.folderStructureService.getChoiceListsByParentId(data).pipe(
                              tap((response: AppHttpResponse) => {
                                response.handle((data: any) => {
                                    const newData = this.customizeTreeDataSource(data);
                                    templateRef = this.setDataByKey(templateRef, propertiesKey, {
                                      key: 'props.options',
                                      value: [...newData]
                                    })
                                  }, () => {
                                    asapScheduler.schedule(() => this.store.dispatch(new ShowFailedToast()))
                                  }
                                )
                              })
                            ).subscribe()
                          }
                        })

                        // in view mode get all children options for the first time
                        let currentValue = get(this.dynamicForm.group.value, relatedPropertiesKey);
                        if (currentValue) {
                          this.folderStructureService.getChoiceListsByParentId(currentValue).pipe(
                            tap((response: AppHttpResponse) => {
                              response.handle((data: any) => {
                                  const newData = this.customizeTreeDataSource(data);
                                  templateRef = this.setDataByKey(templateRef, propertiesKey, {
                                    key: 'props.options',
                                    value: [...newData]
                                  })
                                }, () => {
                                  asapScheduler.schedule(() => this.store.dispatch(new ShowFailedToast()))
                                }
                              )
                            })
                          ).subscribe()
                        }
                      }, () => {
                        asapScheduler.schedule(() => this.store.dispatch(new ShowFailedToast()))
                      }
                    )
                  })
                ).subscribe()
              }
            })

            this.onFormGroupChange.emit(this.dynamicForm);
          }

        }

      })
    )
  }

  ngAfterViewInit() {
    const selector = this.inFolder ? FoldersState.folderProperties : DocumentsState.documentProperties;
    this.subscriptions.add(
      this.store.select(selector).subscribe(value => {
        if (value) {
          this.dynamicForm.model = {...value}
        }
      })
    )
    this.onFormGroupChange.emit(this.dynamicForm);
  }


  private setDataByKey(fields: any[], key: string, data: Data) {
    fields.forEach(field => {
      if (field.key === key) {
        set(field, data.key, data.value)
      }

      if (field.fieldGroup) {
        this.setDataByKey(field.fieldGroup, key, data);
      }
    });

    return fields;
  }

  private setDynamicTreeConfig(fields: any[], key: string, choiceListId: any) {
    fields.forEach(field => {
      if (field.type === 'tree' && field.key === key && !field.props?.treeConfig) {
        set(field, 'props.treeConfig', new DynamicTree(key))
        this.folderStructureService.getChoiceListsByParentId(choiceListId).pipe(
          tap((response: AppHttpResponse) => {
            response.handle((data: any) => {
                const newData = this.customizeTreeDataSource(data);
                this.store.dispatch(new SetArrayByKey(key, newData))
              }, () => {
                asapScheduler.schedule(() => this.store.dispatch(new ShowFailedToast()))
              }
            )
          })
        ).subscribe()
      }
      if (field.fieldGroup) {
        this.setDynamicTreeConfig(field.fieldGroup, key, choiceListId);
      }
    });

    return fields;
  }


  private customizeTreeDataSource(data: any[]) {
    return data.map((item) => {
      return {
        ...item,
        icon: !!get(item, 'isParent') ? 'choice-list' : 'leaf'
      }
    })
  }

}

interface Data {
  key: string;
  value: Observable<any[]> | any[] | ((field: FormlyFieldConfig) => void | ((field: FormlyFieldConfig) => Observable<any>))
}
