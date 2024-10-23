import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {get} from "lodash-es";
import {asapScheduler, tap} from "rxjs";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {ShowFailedToast} from "@app/store/app.action";
import {
  GetAllClassificationsAction,
  GetFilteredDocumentsAction,
  SetAllClassificationsAction,
  SetSearchPageTitleAction
} from "@app/pages/search-template/store/search-template.actions";
import {SearchTemplateService} from "@app/pages/search-template/services/search-template.service";
import {SetDocumentsActionByContainerId} from "@app/pages/folder-structure/store/documents/documents.actions";

export interface SearchTemplateModel {
  classifications: any[];
  searchPageTitle: string;
}

const defaults = {
  classifications: [],
  searchPageTitle: null
}

@State({
  name: 'searchTemplate',
  defaults
})
@Injectable()
export class SearchTemplateState {


  constructor(
    private service: SearchTemplateService) {
  }

  @Selector()
  static classifications(state: SearchTemplateState) {
    return get(state, 'classifications') || [];
  }

  @Selector()
  static searchPageTitle(state: SearchTemplateState) {
    return get(state, 'searchPageTitle') || null;
  }

  @Selector()
  static classDefinitionId(state: SearchTemplateState) {
    return get(state, 'classDefinitionId') || null;
  }

  @Action(GetAllClassificationsAction)
  getAllClassificationsAction({dispatch}: StateContext<SearchTemplateModel>) {
    return this.service.getAllClassifications().pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetAllClassificationsAction(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetAllClassificationsAction)
  SetAllClassificationsAction({patchState}: StateContext<SearchTemplateModel>,
                              {classifications}: SetAllClassificationsAction) {
    patchState({classifications})
  }

  @Action(SetSearchPageTitleAction)
  setSearchPageTitleAction({patchState}: StateContext<SearchTemplateModel>,
                           {searchPageTitle}: SetSearchPageTitleAction) {
    patchState({searchPageTitle})
  }

  @Action(GetFilteredDocumentsAction)
  GetFilteredDocumentsAction({dispatch}: StateContext<SearchTemplateModel>, {payload}: GetFilteredDocumentsAction) {
    return this.service.getFilteredDocuments(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetDocumentsActionByContainerId(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

}
