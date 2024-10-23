import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import {Observable} from "rxjs";
import {get} from "lodash-es";
import {MatMenuConfig} from "@organizo/tree/models/mat-menu";

// The <N> type is the node it will come from API


export abstract class TreeDefinition<N> {

  nestedDataSource: MatTreeNestedDataSource<N>;
  nestedTreeControl: NestedTreeControl<N>;
  dataSource: Array<N> | Observable<Array<N>>;
  matMenu?: Array<MatMenuConfig<N>>;
  selectedNode?: N;
  menuButton?: boolean = false;
  withCheckBox?: boolean = false;

  protected constructor() {
    this.nestedTreeControl = new NestedTreeControl<N>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  customizeId(node: N): any {
    return get(node, "id");
  }

  customizeIcon(node: N): any {
    return get(node, "icon");
  }

  customizeText(node: N): any {
    return get(node, "text");
  }

  customizeHasChildren(node: N): any {
    return get(node, "hasChildren");
  }

  customizeChildren(node: N): any {
    return get(node, "children");
  }

  customizeIsExpanded(node: N): any {
    return get(node, "isExpanded") || false;
  }

  customizeIsChecked(node: N): any {
    return get(node, "isChecked") || false;
  }

  customizeParent(node: N): any {
    return get(node, "parent") || false;
  }

  customizeOnHold(node: N): any {
    return get(node, "onHold") || false;
  }

  setClass(node: N): string {
    return (get(node, 'class') + '') || '';
  }

  onNodeClick(node: N) {
    console.log(node);
  }

  onNodeExpandedChange(node: N, expanded: boolean) {
    console.log(node, expanded);
  }

  onNodeCheckChange(node: N, checked: boolean) {
    console.log(node, checked);
  }


  hasChildren = (_: number, node: N) => this.customizeHasChildren(node);

  private _getChildren = (node: N) => this.customizeChildren(node);
}
