import {concat, isObservable, map, Observable, of, startWith, switchMap, take} from "rxjs";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {get, isDate, isObject} from "lodash-es";
import {SetLoadingAction} from "@app/store/app.action";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";

@Injectable({providedIn: 'root'})
export class ObjectUtilsService {
  constructor(
    private translate: TranslateService
  ) {
  }

  objectToFormData(obj: any): FormData | null {
    if (!obj) return null;
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
      formData.append(key,
        isObject(obj[key]) ?
          (
            (isDate(obj[key]) || obj[key].constructor === File) ?
              obj[key] :
              JSON.stringify(obj[key])
          )
          : obj[key]);
    });
    return formData;
  }

  getLabelByLang(propertyPath: string = ''): string {
    let defaultName = propertyPath;
    if (this.translate.currentLang === 'ar') {
      defaultName = `${propertyPath}${propertyPath ? '.' : ''}arabicName`;
    }
    if (this.translate.currentLang === 'en') {
      defaultName = `${propertyPath}${propertyPath ? '.' : ''}englishName`;
    }
    return defaultName;
  }

  getLabelByLang$(propertyPath: string = ''): Observable<string> {
    const lang$ = this.translate.onLangChange.pipe(startWith({lang: this.translate.currentLang}), map(value => value.lang));
    return concat(of(this.translate.currentLang), lang$).pipe(
      map(() => {
        if (this.translate.currentLang === 'ar') {
          return `${propertyPath}${propertyPath ? '.' : ''}arabicName`;
        }
        return `${propertyPath}${propertyPath ? '.' : ''}englishName`;
      })
    );
  }

  getNameByLang(_obj: any): string {
    if (_obj) {
      const defaultName = _obj.englishName;
      switch (this.translate.currentLang) {
        case 'ar':
          return _obj.arabicName ? _obj.arabicName : defaultName;
        default:
          return _obj.englishName ? _obj.englishName : defaultName;
      }
    }
    return '';
  }

  getNameByLang$(obj: any | Observable<any>): Observable<string> {
    const lang$ = this.translate.onLangChange.pipe(startWith({lang: this.translate.currentLang}), map(value => value.lang));
    return (isObservable(obj) ? obj.pipe(take(1)) : of(obj))
      .pipe(switchMap(_obj => lang$.pipe(map(() => this.getNameByLang(_obj)))));
  }

  rtl$(): Observable<boolean> {
    const lang$ = this.translate.onLangChange.pipe(
      startWith({lang: this.translate.currentLang}),
      map(value => value.lang)
    );
    return lang$.pipe(map(() => {
      switch (this.translate.currentLang) {
        case 'ar':
          return true;
        default:
          return false;
      }
    }));
  }

  rtl(): boolean {
    switch (this.translate.currentLang) {
      case 'ar':
        return true;
      default:
        return false;
    }
  }

  hasPermission(permissions: any[], permissionName: string) {
    return !!(permissions || []).find(value => get(value, 'name') === permissionName);
  }

  startLoader() {
    const store = inject(Store)
    store.dispatch(new SetLoadingAction(true));
  }

  stopLoader() {
    const store = inject(Store)
    store.dispatch(new SetLoadingAction(false));
  }

  customizePagination() {
    let start: number = +localStorage.getItem('start');
    let size: number = +localStorage.getItem('size');

    if (!(start && size)) {
      start = 0;
      size = 5;
      localStorage.setItem('start', start + '');
      localStorage.setItem('size', size + '');
    }

    return {start: start, size: size}
  }
}
