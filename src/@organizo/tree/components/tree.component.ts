import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {isObservable, Observable, of} from "rxjs";
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNestedDataSource,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodeOutlet,
  MatTreeNodePadding,
  MatTreeNodeToggle
} from "@angular/material/tree";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {TreeDefinition} from "@organizo/tree/definition/tree-definition";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {get} from "lodash-es";
import {MatMenuComponent} from "@organizo/dx-grid-cell-templates/components/mat-menu/mat-menu.component";
import {NestedMatMenuComponent} from "@organizo/tree/components/nested-mat-menu/nested-mat-menu.component";
import {NgStyle} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";


@Component({
  selector: 'organizo-tree',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatNestedTreeNode,
    MatTreeNodeOutlet,
    MatMenu,
    MatMenuContent,
    MatMenuItem,
    TranslateModule,
    MatMenuTrigger,
    MatCheckbox,
    MatMenuComponent,
    NestedMatMenuComponent,
    NgStyle,
    MatTooltip
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent extends UnsubscribeComponent implements AfterViewInit {
  @ViewChild(MatMenu) matMenu: MatMenu;
  nestedDataSource: MatTreeNestedDataSource<any>;
  nestedTreeControl: NestedTreeControl<any>;
  dataSource: Observable<Array<any>>;
  @Output('selectedNodeChange') selectedNodeChange: EventEmitter<any> = new EventEmitter<any>();
  public contextNode: any;
  #selectedNode: any;

  constructor() {
    super();

  }

  _config: TreeDefinition<any>;

  @Input() set config(value: TreeDefinition<any>) {
    this._config = value;
    this.nestedDataSource = value?.nestedDataSource;
    this.nestedTreeControl = value?.nestedTreeControl;
    if (!isObservable(value?.dataSource)) this.dataSource = of(value?.dataSource);
    else this.dataSource = value?.dataSource;
  }

  get selectedNode(): any {
    return this.#selectedNode;
  }

  @Input('selectedNode') set selectedNode(value: any) {
    this.#selectedNode = value;
    this.selectedNodeChange.emit(value);
  }


  ngAfterViewInit() {
    if (this.nestedTreeControl && this.nestedDataSource) {
      this.subscriptions.add(
        this.dataSource.subscribe(data => {
          if (data) {
            this.nestedDataSource.data = data;
          }
        })
      );
    }

    this.subscriptions.add(
      this.matMenu?.closed.subscribe(() => {
        this.contextNode = null
      })
    )
  }

  openMatMenu(matMenuTrigger: MatMenuTrigger, event: MouseEvent) {
    if (!this._config.matMenu) return;
    event.stopPropagation();
    event.preventDefault();
    matMenuTrigger.openMenu();
  }

  emptyFun: Function = () => {
  };

  selectNode(node: any, nodeTemplate: HTMLDivElement) {
    this._config.onNodeClick(node);
    this.selectedNode = node;
    nodeTemplate.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  contextMenuTrigger(node: any, matMenuTrigger: MatMenuTrigger, $event: MouseEvent) {
    this.contextNode = node;
    if (this._config.menuButton) return;
    this.openMatMenu(matMenuTrigger, $event);
  }

  onNodeCheckedChange(node: any, event: any) {
    this._config.onNodeCheckChange(node, get(event, 'checked'))
  }

}
