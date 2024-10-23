import {Observable} from "rxjs";
import {TreeDefinition} from "@organizo/tree/definition/tree-definition";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {get} from "lodash-es";
import { FoldersState } from "../store/folders/folders.state";
import {GetDynamicTreeByParentIdAndKeyAction, SetDynamicTreeNodeIsCheckedByKeyAction, SetDynamicTreeNodeIsExpandedByKeyAction } from "../store/folders/folders.actions";


export interface DynamicTreeNode {
  objectId: string;
  name: string;
  icon?: 'choice-list' | 'leaf';
  isParent: boolean;
  children?: Array<DynamicTreeNode>;
  isExpanded: boolean;
  parent: DynamicTreeNode;
  path: string;
  isChecked: boolean;
}

export class DynamicTree extends TreeDefinition<DynamicTreeNode> {
  store = inject(Store);

  key: string;

  override dataSource: Observable<Array<DynamicTreeNode>>
  override withCheckBox = true;

  constructor(key?: string) {
    super();
    if (!!key) {
      this.key = key
      this.dataSource = this.store.select(FoldersState.dynamicTreeByKey(key))
    }
  }

  override customizeId(node: DynamicTreeNode): any {
    return get(node, "objectId");
  }

  override customizeText(node: DynamicTreeNode): any {
    return get(node, "name");
  }

  override customizeHasChildren(node: DynamicTreeNode): any {
    return get(node, "isParent")
  }

  override customizeIsChecked(node: DynamicTreeNode): any {
    return get(node, 'isChecked');
  }

  override onNodeCheckChange(node: DynamicTreeNode, checked: boolean) {
    this.store.dispatch(new SetDynamicTreeNodeIsCheckedByKeyAction(this.key, node, checked))
  }

  override onNodeExpandedChange(node: DynamicTreeNode, expanded: boolean) {
    if (expanded) {
      this.store.dispatch(new GetDynamicTreeByParentIdAndKeyAction(this.key, get(node, 'objectId'), node))
    }
    this.store.dispatch(new SetDynamicTreeNodeIsExpandedByKeyAction(this.key, node, expanded));
  }
}
