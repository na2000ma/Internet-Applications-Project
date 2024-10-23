import {FolderFieldInNode} from "@app/pages/folder-structure/trees/document-folders-field-in.tree";

export class GetDocumentsActionByContainerId {
  static readonly type = '[documents] Get Documents By Container Id'

  constructor(public containerId: any) {
  }
}

export class SetDocumentsActionByContainerId {
  static readonly type = '[documents] Set Documents By Container Id'

  constructor(public payload: any) {
  }
}


export class GetDocumentContentById {
  static readonly type = '[documents] Get Document Content'

  constructor(public id: any, public forDownload = false) {
  }
}

export class SetDocumentContentById {
  static readonly type = '[documents] Set Document Content'

  constructor(public payload: any, public forDownload: boolean = false) {
  }
}

export class SetSelectedDocument {
  static readonly type = '[documents] Set Selected Document'

  constructor(public payload: any, public forDownload: boolean = false) {
  }
}

export class GetDocumentPropertiesAction {
  static readonly type = '[documents] Get Document Properties'

  constructor(public objectId: any, public tableName: any) {
  }
}

export class SetDocumentProperties {
  static readonly type = '[documents] Set Document Properties'

  constructor(public payload: any) {
  }
}

export class SetViewContent {
  static readonly type = '[documents] Set View Content'

  constructor(public status: boolean) {
  }
}

export class GetDocumentVersions {
  static readonly type = '[documents] Get Document Versions'

  constructor(public vsId: any) {
  }
}

export class SetDocumentVersions {
  static readonly type = '[documents] Set Document Versions'

  constructor(public payload: any) {
  }
}

export class GetAvailableClasses {
  static readonly type = '[documents] Get Available Classes'

  constructor(public containerId: any) {
  }
}

export class SetAvailableClasses {
  static readonly type = '[documents] Set Available Classes'

  constructor(public payload: any) {
  }
}

export class GetAllClassHierarchical {
  static readonly type = '[documents] Get All Class Hierarchical'

  constructor(public objectId: any) {
  }
}

export class SetAllClassHierarchical {
  static readonly type = '[documents] Set All Class Hierarchical'

  constructor(public payload: any) {
  }
}

export class SetFolderFieldInNode {
  static readonly type = '[documents] Set Folder Field In Node'

  constructor(public payload: any, public currentNode?: FolderFieldInNode) {
  }
}

export class SetFolderFieldInNodeExpanded {
  static readonly type = '[documents] Set Folder Field In Node Expanded'

  constructor(public currentNode: FolderFieldInNode, public isExpanded: boolean) {
  }
}

export class GetAvailableClassificationsForFolder {
  static readonly type = '[documents] Get Available Containers'

  constructor() {
  }
}

export class SetAvailableContainers {
  static readonly type = '[documents] Set Available Containers'

  constructor(public payload: any) {
  }
}

export class GetAvailableDocumentClasses {
  static readonly type = '[documents] Get All Tables Name'

  constructor() {
  }
}

export class SetAvailableDocumentClasses {
  static readonly type = '[documents] Set All Tables Name'

  constructor(public payload: any) {
  }
}

export class SetGeneralFormValue {
  static readonly type = '[documents] Set General Form Value'

  constructor(public payload: any) {
  }
}

export class DocumentCheckOutAction {
  static readonly type = '[documents] Document Check Out Action'

  constructor(public payload: any, public containerId: any) {
  }
}

export class GetDocumentFolderFieldIn {
  static readonly type = '[documents] Get Document Folder Field In'

  constructor(public payload: any) {
  }
}

export class SetDocumentFolderFieldIn {
  static readonly type = '[documents] Set Document Folder Field In'

  constructor(public payload: any) {
  }
}

export class GetTreeDocumentFoldersFieldIn {
  static readonly type = '[documents] Get Tree Document Folders Field In'

  constructor(public payload: any, public currentNode?: any) {
  }
}

export class SetCheckboxFolderFieldIn {
  static readonly type = '[documents] Toggle Checkbox Folder Field In';

  constructor(public currentNode: any, public isChecked: boolean = false) {
  }
}

export class SetDeletedItemFromGridFolderFieldIn {
  static readonly type = '[documents] Delete Document Folder Field In';

  constructor(public node: FolderFieldInNode) {
  }
}

export class GetAvailableClassificationsByContainerIdForDocument {
  static readonly type = '[folderStructure] Get Available Classifications By Container Id'

  constructor(public containerId: any) {
  }
}

export class SetAvailableClassifications {
  static readonly type = '[folderStructure] Set Available Classifications By Container Id'

  constructor(public data: any, public forFolder: boolean = false) {
  }
}

export class AddDocumentAction {
  static readonly type = '[folderStructure] Add Document Action'

  constructor(public payload: any, public containerId: any) {
  }
}

export class DocumentCheckInAction {
  static readonly type = '[folderStructure] Document Check In Action'

  constructor(public payload: any, public containerId: any) {
  }
}

export class DocumentCancelCheckOutAction {
  static readonly type = '[folderStructure] Document Cancel Check Out Action'

  constructor(public objectId: any, public containerId: any) {
  }
}

export class EditDocumentPropertiesAction {
  static readonly type = '[folderStructure] Edit Document Properties Action'

  constructor(public payload: any) {
  }
}

export class EditDocumentTitleAction {
  static readonly type = '[folderStructure] Edit Document Title Action'

  constructor(public payload: any, public containerId: any) {
  }
}

export class DeleteDocumentAction {
  static readonly type = '[folderStructure] Delete Document Action'

  constructor(public payload: any, public fromAllContainers: boolean, public containerId: boolean) {
  }
}

export class LunchWorkFlowAction {
  static readonly type = '[folderStructure] Lunch Work Flow Action';

  constructor(public payload: any) {

  }
}


