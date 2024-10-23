import {Injectable, NgZone} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {SetLoadingAction, ShowFailedToast, ShowSuccessToast, StartLoaderAction} from "@app/store/app.action";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "@organizo/services/toast-service/toast.service";
import {get} from "lodash-es";


class AppStateModel {
  loading: boolean;
  startLoader: boolean;
}

const defaults = {
  loading: false,
  startLoader: false
}

@State({
  name: "app",
  defaults
})

@Injectable()
export class AppState {

  constructor(
    private toastService: ToastService,
    private zone: NgZone,
    private translateService: TranslateService
  ) {
  }

  @Selector()
  static loading(state: AppStateModel) {
    return get(state, 'loading') || false;
  }

  @Selector()
  static startLoader(state: AppStateModel) {
    return get(state, 'startLoader') || false;
  }

  @Action(ShowSuccessToast)
  showSuccessToast({}: StateContext<AppStateModel>, {message}: ShowSuccessToast) {
    if (message == "null" || !message)
      return
    this.zone.run(() => {
      this.toastService.push({
        action: this.translateService.instant('app.close'),
        config: {
          duration: 3000,
          // direction: ObjectUtils.getDirection(),
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        },
        message: this.translateService.instant(message)
      });
    })

  }

  @Action(ShowFailedToast)
  showFailedToast({}: StateContext<AppStateModel>, {message}: ShowFailedToast) {
    if (message == "null" || !message)
      return
    this.zone.run(() => {
      this.toastService.push({
        action: this.translateService.instant('app.close'),
        config: {
          duration: 3000,
          // direction: ObjectUtils.getDirection(),
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        },
        message: this.translateService.instant(message)
      });
    })

  }

  @Action(SetLoadingAction)
  setLoadingAction({patchState}: StateContext<AppStateModel>, {value}: SetLoadingAction) {
    patchState({
      loading: value
    })
  }

  @Action(StartLoaderAction)
  startLoaderAction({patchState}: StateContext<AppStateModel>, {value}: StartLoaderAction) {
    patchState({
      startLoader: value
    })
  }

}
