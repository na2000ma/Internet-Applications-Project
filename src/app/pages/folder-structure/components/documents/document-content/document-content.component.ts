import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {get} from 'lodash-es';
import {MimeTypes} from "@organizo/dx-grid-cell-templates/components/type-with-icon/type-with-icon.component";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {SafeResourceUrl} from "@angular/platform-browser";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {SetDocumentContentById, SetViewContent} from "@app/pages/folder-structure/store/documents/documents.actions";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {Permissions} from "@app/pages/security-template/dummy-data/permissions";

@Component({
  selector: 'organizo-document-content',
  templateUrl: './document-content.component.html',
  styleUrl: './document-content.component.scss'
})
export class DocumentContentComponent extends UnsubscribeComponent implements OnInit, OnDestroy {

  fileType: { mimeType: string; ext: string; };
  selectedDocument: any;

  readonly MimeTypes = MimeTypes;
  readonly get = get;
  readonly #documentContent$: Observable<any>;
  readonly #selectedDocument$: Observable<any>;
  #sanitizedURL: SafeResourceUrl;

  constructor(
    private store: Store,
    private objectUtilsService: ObjectUtilsService,
    private folderStructureUtilsService: FolderStructureUtilsService
  ) {
    super();
    this.#documentContent$ = this.store.select(DocumentsState.documentContent);
    this.#selectedDocument$ = this.store.select(DocumentsState.selectedDocument);
    this.subscriptions.add(
      this.#documentContent$.subscribe(value => {
        if (value) {
          this.#sanitizedURL = this.objectUtilsService.sanitizeFileByURL(this.objectUtilsService.getURLFromBlob(get(value, 'blob')));
        }
      })
    )
  }

  get documentContent$(): Observable<any> {
    return this.#documentContent$;
  }

  get sanitizedURL(): SafeResourceUrl {
    return this.#sanitizedURL;
  }

  get selectedDocument$(): Observable<any> {
    return this.#selectedDocument$;
  }

  get canViewProperties() {
    return this.objectUtilsService.hasPermission(
        get(this.selectedDocument, 'features'), Permissions.document.fullControl) ||
      this.objectUtilsService.hasPermission(
        get(this.selectedDocument, 'features'), Permissions.document.edit) ||
      this.objectUtilsService.hasPermission(
        get(this.selectedDocument, 'features'), Permissions.document.view)
  }

  ngOnInit() {
    this.setMimeType();
  }

  closeContent() {
    this.store.dispatch(new SetDocumentContentById(null))
    this.store.dispatch(new SetViewContent(false))
  }


  getDocumentProperties() {
    this.folderStructureUtilsService.openFolderOrDocumentPropertiesDialog(this.subscriptions, this.store.selectSnapshot(DocumentsState.selectedDocument), false)
  }

  override ngOnDestroy() {
    this.store.dispatch(new SetDocumentContentById(null))
    this.store.dispatch(new SetViewContent(false))
    super.ngOnDestroy();
  }

  private setMimeType() {
    this.subscriptions.add(
      this.store.select(DocumentsState.selectedDocument).subscribe(data => {
        if (data) {
          this.selectedDocument = data;
          const mimeType: string = get(data, 'mimeType');
          let ext: string = null;
          if (mimeType) {
            for (const type in MimeTypes) {
              if (MimeTypes[type] === mimeType) {
                ext = type;
                break;
              }
            }
          }
          this.fileType = {mimeType, ext};
        }
      })
    )
  }
}
