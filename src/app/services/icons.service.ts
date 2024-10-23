import {inject, Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from "@env/environment";

@Injectable({providedIn: 'root'})
export class IconsService {
  /**
   * Constructor
   */
  constructor() {
    const domSanitizer = inject(DomSanitizer);
    const matIconRegistry = inject(MatIconRegistry);

    // Register icon sets
    matIconRegistry.addSvgIconSetInNamespace('organizo-outline-icons', domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/organizo-outline-icons.svg`));
    matIconRegistry.addSvgIconSetInNamespace('organizo-solid-icons', domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/organizo-solid-icons.svg`));
    matIconRegistry.addSvgIconSetInNamespace('organizo-mini-icons', domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/organizo-mini-icons.svg`));

    //Logo
    matIconRegistry.addSvgIcon(
      "logo",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/logo/logo.svg`)
    );

    matIconRegistry.addSvgIcon(
      "logo-text",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/logo/logo-text.svg`)
    );

    // Active Directory
    matIconRegistry.addSvgIcon(
      "grid-mode",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/grid-mode.svg`)
    );

    matIconRegistry.addSvgIcon(
      "normal-mode",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/normal-mode.svg`)
    );

    matIconRegistry.addSvgIcon(
      "folder-structure",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/folder-structure.svg`)
    );

    matIconRegistry.addSvgIcon(
      "folder",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/folderIcon.svg`)
    );

    matIconRegistry.addSvgIcon(
      "add-folder",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/add-folder.svg`)
    );

    matIconRegistry.addSvgIcon(
      "sub-folder",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/sub-folder.svg`)
    );

    matIconRegistry.addSvgIcon(
      "group",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/groupIcon.svg`)
    );

    matIconRegistry.addSvgIcon(
      "add-group",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/add-group.svg`)
    );

    matIconRegistry.addSvgIcon(
      "user",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/userIcon.svg`)
    );

    matIconRegistry.addSvgIcon(
      "add-user",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/add-user.svg`)
    );

    matIconRegistry.addSvgIcon(
      "trash",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/trash.svg`)
    );

    matIconRegistry.addSvgIcon(
      "edit",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/edit.svg`)
    );

    matIconRegistry.addSvgIcon(
      "closeDialog",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/close-dialog.svg`)
    );

    matIconRegistry.addSvgIcon(
      "imgUploader",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/image-uploader.svg`)
    );
    matIconRegistry.addSvgIcon(
      "general",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/general-icon.svg`)
    );
    matIconRegistry.addSvgIcon(
      "account",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/user-account.svg`)
    );

    matIconRegistry.addSvgIcon(
      "folder-bg",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/folder-bg.svg`)
    );

    matIconRegistry.addSvgIcon(
      "circle",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/circle.svg`)
    );

    matIconRegistry.addSvgIcon(
      "options",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/options.svg`)
    );

    matIconRegistry.addSvgIcon(
      "paste",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/paste.svg`)
    );

    matIconRegistry.addSvgIcon(
      "document",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/active-directory/document.svg`)
    );


    // Content Engine

    matIconRegistry.addSvgIcon(
      "items",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/items.svg`)
    );

    matIconRegistry.addSvgIcon(
      "attributes",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/attributes.svg`)
    );

    matIconRegistry.addSvgIcon(
      "default-instance-security",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/default-instance-security.svg`)
    );

    matIconRegistry.addSvgIcon(
      "security",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/security.svg`)
    );

    matIconRegistry.addSvgIcon(
      "inherited-properties",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/inherited-properties.svg`)
    );

    matIconRegistry.addSvgIcon(
      "choice-list",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/choice-list.svg`)
    );

    matIconRegistry.addSvgIcon(
      "colored-document",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/colored-document.svg`)
    );

    matIconRegistry.addSvgIcon(
      "custom-object",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/custom-object.svg`)
    );

    matIconRegistry.addSvgIcon(
      "without-documents",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/without-documents.svg`)
    );

    matIconRegistry.addSvgIcon(
      "add-document",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/add-document.svg`)
    );

    matIconRegistry.addSvgIcon(
      "add-folder",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/add-folder.svg`)
    );

    matIconRegistry.addSvgIcon(
      "view-folder-property",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/view-folder-property.svg`)
    );

    matIconRegistry.addSvgIcon(
      "check-in",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/check-in.svg`)
    );

    matIconRegistry.addSvgIcon(
      "check-out",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/check-out.svg`)
    );

    matIconRegistry.addSvgIcon(
      "folders-field-in",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/folders-field-in.svg`)
    );

    matIconRegistry.addSvgIcon(
      "linked-documents",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/linked-documents.svg`)
    );

    matIconRegistry.addSvgIcon(
      "versions",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/versions.svg`)
    );

    matIconRegistry.addSvgIcon(
      "view-content",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/view-content.svg`)
    );

    matIconRegistry.addSvgIcon(
      "workflow",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/workflow.svg`)
    );

    matIconRegistry.addSvgIcon(
      "open",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/open.svg`)
    );

    matIconRegistry.addSvgIcon(
      "hold",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/hold.svg`)
    );

    matIconRegistry.addSvgIcon(
      "sub-class",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/sub-class.svg`)
    );

    matIconRegistry.addSvgIcon(
      "plus-square",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/plus-square.svg`)
    );

    matIconRegistry.addSvgIcon(
      "entry-design",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/entry-design.svg`)
    );

    matIconRegistry.addSvgIcon(
      "freeze",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/freeze.svg`)
    );

    matIconRegistry.addSvgIcon(
      "grid-design",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/grid-design.svg`)
    );

    matIconRegistry.addSvgIcon(
      "search-design",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/search-design.svg`)
    );

    matIconRegistry.addSvgIcon(
      "leaf",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/content-engine/leaf.svg`)
    );

    matIconRegistry.addSvgIcon(
      "entry-template",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/entry-template/entry-template.svg`)
    );

    matIconRegistry.addSvgIcon(
      "add-operation",
      domSanitizer.bypassSecurityTrustResourceUrl(`${environment.base}assets/icons/entry-template/add-operation.svg`)
    );


  }
}
