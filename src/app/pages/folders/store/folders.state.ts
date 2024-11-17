import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {get} from "lodash-es";
import {tap} from "rxjs";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {AddFileAction, GetAcceptedFilesAction, SetAcceptedFilesAction} from "@app/pages/folders/store/folders.actions";
import {FoldersService} from "@app/pages/folders/services/folders.service";

export interface FoldersModel {
  acceptedFiles: any[]
}

const defaults = {
  acceptedFiles: []
}

@State({
  name: 'folders',
  defaults
})
@Injectable()
export class FoldersState {


  constructor(private foldersService: FoldersService) {
  }

  @Selector()
  static acceptedFiles(state: FoldersState) {
    return get(state, 'acceptedFiles') || [];
  }

  @Action(GetAcceptedFilesAction)
  getAcceptedFilesAction({dispatch}: StateContext<FoldersModel>) {
    return this.foldersService.getAcceptedFiles().pipe(
      tap((response: AppHttpResponse) => {
        response.handle(data => {
          dispatch(new SetAcceptedFilesAction(get(data, 'files')))
        })
      })
    )
  }

  @Action(SetAcceptedFilesAction)
  setAcceptedFilesAction({patchState}: StateContext<FoldersModel>, {payload}: SetAcceptedFilesAction) {
    return patchState({
      acceptedFiles: payload
    })
  }

  @Action(AddFileAction)
  addFileAction({dispatch}: StateContext<FoldersModel>, {payload}: AddFileAction) {
    return this.foldersService.addFile(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(data => {
          dispatch(new GetAcceptedFilesAction())
        })
      })
    )
  }
}
