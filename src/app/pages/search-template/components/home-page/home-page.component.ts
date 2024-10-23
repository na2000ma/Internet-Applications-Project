import {Component, OnInit} from '@angular/core';
import {ClassificationSearchForm} from "@app/pages/search-template/forms/classification-search.form";
import {DocumentsGrid} from "@app/pages/folder-structure/grids/documents.grid";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {Store} from "@ngxs/store";
import {
  GetAllClassificationsAction,
  GetFilteredDocumentsAction
} from "@app/pages/search-template/store/search-template.actions";
import {DynamicForm} from "@app/pages/folder-structure/forms/dynamic.form";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {Observable} from "rxjs";
import {SearchTemplateState} from "@app/pages/search-template/store/search-template.state";
import {get} from "lodash-es";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {SetDocumentsActionByContainerId} from "@app/pages/folder-structure/store/documents/documents.actions";

@Component({
  selector: 'organizo-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent extends UnsubscribeComponent implements OnInit {

  classificationSearch: ClassificationSearchForm = new ClassificationSearchForm();
  gridDef: DocumentsGrid = new DocumentsGrid(this.subscriptions);
  dynamicSearchForm: DynamicForm = new DynamicForm();

  hideTemplate: boolean = true;
  hideGrid: boolean = true;

  searchPageName$: Observable<string>;


  constructor(
    private store: Store,
    private folderStructureUtilsService: FolderStructureUtilsService
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new GetAllClassificationsAction())

    this.searchPageName$ = this.store.select(SearchTemplateState.searchPageTitle)

    this.subscriptions.add(
      this.store.select(FoldersState.template).subscribe(template => {
        if (template && template.length > 0) {
            this.dynamicSearchForm = new DynamicForm(template);
            this.hideTemplate = false;
          }
        }
      )
    )
  }


  getFilteredDocuments(model: any) {
    const template = this.store.selectSnapshot(FoldersState.template);
    let payload = {
      domain: {
        classificationClass: {objectId: get(this.classificationSearch.model, 'classification')},
        filters: this.folderStructureUtilsService.optimizeDataSourceForFilteredDocuments(template, model),
        pagination: {
          start: 0,
          size: 5
        }
      }
    }

    this.subscriptions.add(
      this.store.dispatch(new GetFilteredDocumentsAction(payload)).subscribe({
        complete: () => {
          this.hideGrid = false;
        }
      })
    )
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(new SetDocumentsActionByContainerId(null));
  }
}
