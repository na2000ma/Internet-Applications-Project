import {BehaviorSubject, concat, isObservable, map, Observable, of, startWith, switchMap, take} from "rxjs";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {get, isDate, isObject} from "lodash-es";
import {SetLoadingAction} from "@app/store/app.action";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {DomSanitizer} from "@angular/platform-browser";
import {saveAs} from "file-saver";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class ObjectUtilsService {
  constructor(
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private store: Store
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

  decodedContentByBase64(content: any, forDownload: boolean = false) {

    let subject = new BehaviorSubject(null);

    // Get document type
    if (forDownload) {
      this.store.select(DocumentsState.documentForDownload).subscribe(data => {
        const type = get(data, 'mimeType');
        if (type) {
          subject.next(this.handleContent(content, type));
        }
      })
    } else {
      this.store.select(DocumentsState.selectedDocument).subscribe(data => {
        const type = get(data, 'mimeType');
        if (type) {
          subject.next(this.handleContent(content, type));
        }
      })
    }
    return subject;
  }

  handleContent(content: any, type: any) {
    // Decode the Base64 string
    const byteCharacters = atob(content);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    // Create a Blob from the byteArray
    const blob = new Blob([byteArray], {type: type});

    return {blob, byteArray};
  }

  getURLFromBlob(blob: Blob) {
    // Generate a URL for the Blob
    return URL.createObjectURL(blob);
  }

  sanitizeFileByURL(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  downloadFile(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }

  // async downloadFileAsPDF(byteArray: any, fileName: string) {
  //   // Create a PDF document
  //   const pdfDoc = await PDFDocument.create();
  //   pdfDoc.registerFontkit(fontkit);
  //
  //   // Load a custom font
  //   const fontUrl = 'assets/fonts/Roboto-Regular.ttf';
  //   const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  //   const customFont = await pdfDoc.embedFont(fontBytes);
  //
  //   const page = pdfDoc.addPage();
  //   const {width, height} = page.getSize();
  //
  //   // Decode the text content from byte array to a string
  //   const text = new TextDecoder().decode(byteArray);
  //   const fontSize = 12;
  //   const textWidth = width - 50;
  //
  //   page.drawText(text, {
  //     x: 25,
  //     y: height - 25 - fontSize,
  //     size: fontSize,
  //     font: customFont,
  //     maxWidth: textWidth
  //   });
  //
  //   // Serialize the PDF document to bytes (a Uint8Array)
  //   const pdfBytes = await pdfDoc.save();
  //
  //   // Create a Blob from the PDF bytes
  //   const blob = new Blob([pdfBytes], {type: 'application/pdf'});
  //
  //   this.downloadFile(blob, fileName);
  // }

  transformDocumentAttributes(obj: any) {
    let response = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const attribute = key.split('_Info_')[1];
        response = {
          ...response,
          [attribute]: obj[key]
        }
      }
    }
    return response;
  }

  addQueryParams(name: string, value: any) {
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);
    return router.navigate(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          [name]: value
        },
        queryParamsHandling: "merge"
      }
    )
  }

  removeFromQueryParamByKey(keys: any[]) {
    const activatedRoute = inject(ActivatedRoute);
    const router = inject(Router);
    let obj = {};
    for (const key of keys) {
      if (activatedRoute.snapshot.queryParams[key]) {
        obj = {
          ...obj,
          [key]: null
        }
      }
    }
    router.navigate(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          ...obj
        },
        queryParamsHandling: "merge"
      }
    )
  }

  removeDuplicatesByKey<T extends { [key: string]: any }>(array: T[], key: keyof T): T[] {
    const seen = new Set<any>();
    return array.filter(item => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
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
