import {get} from "lodash-es";
import {TreeDefinition} from "@organizo/tree/definition/tree-definition";
import {Observable} from "rxjs";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {
  GetTreeDocumentFoldersFieldIn,
  SetCheckboxFolderFieldIn,
  SetFolderFieldInNodeExpanded
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";

export interface FolderFieldInNode {
  objectId: any;
  containerName: string;
  icon: 'folder';
  isParent: boolean;
  children: Array<FolderFieldInNode>;
  isExpanded: boolean;
  documentExist: boolean;
  allowAddDocument: boolean;
  containerPath: string;
  path: string;
}

export class DocumentFoldersFieldInTree extends TreeDefinition<FolderFieldInNode> {
  override dataSource: Array<FolderFieldInNode> | Observable<Array<FolderFieldInNode>> = inject(Store).select(DocumentsState.foldersFieldInTree);
  override withCheckBox = true;

  classificationId: any;
  editMode: boolean;
  documentId: any;

  constructor(classificationId?: any, editMode?: boolean, documentId ?: any) {
    super();
    this.classificationId = classificationId;
    this.editMode = editMode;
    this.documentId = documentId;
  }

  override customizeId(node: FolderFieldInNode): any {
    return get(node, "objectId");
  }

  override customizeText(node: FolderFieldInNode): string {
    return get(node, "containerName");
  }

  override customizeHasChildren(node: FolderFieldInNode): boolean {
    return get(node, "isParent");
  }

  override customizeIsChecked(node: FolderFieldInNode): any {
    return get(node, "documentExist") || false;
  }

  override customizeOnHold(node: FolderFieldInNode): any {
    return !get(node, "allowAddDocument") || false;
  }

  override onNodeClick(node: FolderFieldInNode) {
    console.log(node)
  }

  override onNodeExpandedChange(node: FolderFieldInNode, expanded: boolean) {

    const store = inject(Store);


    store.dispatch(new SetFolderFieldInNodeExpanded(node, expanded));

    if (this.customizeHasChildren(node) && !this.customizeChildren(node)) {
      let payload: any;
      if (this.editMode) {
        payload = {
          parentContainerId: this.customizeId(node),
          classificationId: this.classificationId,
          documentId: this.documentId
        }
      } else {
        payload = {
          parentContainerId: this.customizeId(node),
          classificationId: this.classificationId
        }
      }
      store.dispatch(new GetTreeDocumentFoldersFieldIn(payload, node))

    }


  }

  override onNodeCheckChange(node: FolderFieldInNode, checked: boolean) {

    const store = inject(Store);

    if (this.customizeOnHold(node)) return;

    store.dispatch(new SetCheckboxFolderFieldIn({...node}, checked));


  }


}
