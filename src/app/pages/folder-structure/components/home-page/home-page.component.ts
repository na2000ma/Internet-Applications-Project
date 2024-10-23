import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {organizoAnimations} from "@organizo/animations/organizo.animations";
import {Store} from "@ngxs/store";
import {ContainerNode, ContainerTree} from "@app/pages/folder-structure/trees/container.tree";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {lastValueFrom, Observable, take} from "rxjs";
import {get} from "lodash-es";
import {OrganizoDrawerComponent} from "@organizo/components/drawer/drawer.component";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {
  GetParentsAction,
  GetPathActionByContainerId,
  SetIfCrumbClicked,
  SetPathAction,
  SetSelectedNodeAction
} from '../../store/folders/folders.actions';
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {AuthState} from '@app/pages/auth/store/auth.state';
import {SetDocumentsActionByContainerId} from "@app/pages/folder-structure/store/documents/documents.actions";

@Component({
  selector: 'organizo-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  animations: organizoAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent extends UnsubscribeComponent implements OnInit, AfterViewInit, OnDestroy {

  treeDef: ContainerTree;

  documents$: Observable<any>;
  viewContent$: Observable<any>;


  @ViewChild('docsTreeDrawer') docsTreeDrawer: OrganizoDrawerComponent;

  @ViewChild('parentElement') parentElement: ElementRef<HTMLDivElement>;
  @ViewChild('docsListElement') docsListElement: ElementRef<HTMLDivElement>;

  documentContentWidth: string = '60%';
  warnedBorder: boolean = false;

  isCrumbClicked: boolean;

  accessDenied: boolean = false;

  constructor(
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private objectUtilsService: ObjectUtilsService,
    private folderStructureUtilsService: FolderStructureUtilsService
  ) {
    super();
    this.treeDef = new ContainerTree(this.subscriptions);
    this.documents$ = this.store.select(DocumentsState.documents);
    this.viewContent$ = this.store.select(DocumentsState.viewContent);
  }

  get canAddFolder() {
    return get(this.store.selectSnapshot(AuthState.authUser), 'role') === 'Organization Admin'
  }

  async ngOnInit() {

    this.setValueIfBreadCrumbClicked();

    this.store.dispatch(new GetParentsAction());

    await this.getPathWhenRefreshThePage();

    this.objectUtilsService.removeFromQueryParamByKey(['mode']);

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['access'] === 'denied') {
        this.accessDenied = true;
      }
    })

  }

  ngAfterViewInit() {
    // this.objectUtilsService.stopLoader();

    this.customizeAPIsWhenParamsChange();

    new ResizeObserver(() => {
      this.resizeElements(this.parentElement.nativeElement, this.docsListElement.nativeElement);
    }).observe(this.docsListElement.nativeElement);

  }

  toggleDrawer() {
    this.docsTreeDrawer.toggle();
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          treeOpened: this.docsTreeDrawer.opened
        },
        queryParamsHandling: 'merge'
      }
    )
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  openAddFolderDialog() {
    if (this.activatedRoute.snapshot.queryParams['containerId']) {
      this.router.navigate([],
        {
          relativeTo: this.activatedRoute,
          queryParams: {
            containerId: null
          },
          queryParamsHandling: "merge"
        }
      ).then(value => {
        if (value) {
          this.treeDef.selectedNode = null;
          this.store.dispatch(new SetDocumentsActionByContainerId(null))
          this.store.dispatch(new SetSelectedNodeAction(null))
          this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, null, true)
          this.objectUtilsService.addQueryParams('dialog', 'addFolder').then(() => {
            this.objectUtilsService.addQueryParams('classType', 'Folder')
          })
        }
      })
    } else {
      this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, null, true)
      this.objectUtilsService.addQueryParams('dialog', 'addFolder').then(() => {
        this.objectUtilsService.addQueryParams('classType', 'Folder')
      })
    }
  }

  private resizeElements(parent: HTMLDivElement, child: HTMLDivElement) {
    const parentWidth = +parent.offsetWidth;
    const childWidth = +child.style.width.replace('px', '') || parentWidth / 2;
    const docsViewWidth = parentWidth - childWidth;
    this.documentContentWidth = docsViewWidth + 'px';
    this.warnedBorder = childWidth < 400 || docsViewWidth < 400;
    if (this.warnedBorder) {
      setTimeout(() => {
        this.warnedBorder = false;
        this.cdr.detectChanges();
      }, 1000);
    }
    this.cdr.detectChanges();
  }

  private findNodeById(nodes: any[], objectId: any) {
    for (const node of nodes) {
      if (node.objectId === objectId) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        return this.findNodeById(node.children, objectId) ?? null;
      }
    }
    return null;
  }

  private setValueIfBreadCrumbClicked() {
    this.subscriptions.add(
      this.store.select(FoldersState.isCrumbClicked).subscribe(value => this.isCrumbClicked = value)
    )
  }

  private async getPathWhenRefreshThePage() {
    this.store.dispatch(new SetIfCrumbClicked(false));
    if (this.activatedRoute.snapshot.queryParams['containerId']) {
      await lastValueFrom(this.store.dispatch(new GetPathActionByContainerId(this.activatedRoute.snapshot.queryParams['containerId'])));
      //Refresh the tree
      this.store.select(FoldersState.path)
        .pipe(take(2))
        .subscribe(async (res) => {
          if ((res || []).length) {
              this.resolveSelected(res);
            }
          }
        )
    }
  }

  private customizeAPIsWhenParamsChange() {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        if (params['containerId'] && this.isCrumbClicked) {
          this.refreshSelectedNode(params['containerId'])
        }
        if (params['treeOpened'] === 'true') {
          this.docsTreeDrawer.open();
        }
      })
    );
  }

  private refreshSelectedNode(containerId: any) {
    this.subscriptions.add(
      this.store.select(FoldersState.tree).subscribe(data => {
        if ((data || []).length > 0) {
          const node: ContainerNode = this.findNodeById(data, containerId);
          if (node) {
            this.treeDef.onNodeClick(node);
            this.treeDef.onNodeExpandedChange(node, true);
            this.treeDef.selectedNode = node;
          }
        }
      })
    )
  }

  private resolveSelected(idx: any[]) {
    this.isCrumbClicked = false;
    if (idx.length === 0) {
      return;
    }
    idx = [null, ...idx];
    let previousNode: ContainerNode = null;
    this.store.select(FoldersState.tree).subscribe(res => {
      if (idx.length === 0) {
        return;
      }
      if (!idx[0]) {
        this.store.dispatch(new GetParentsAction());
        this.store.dispatch(new SetPathAction([]));
        previousNode = idx.shift();
        return;
      }
      const levelNodes: ContainerNode[] = previousNode ? get(res, `${previousNode.path}.children`) : res;
      if (levelNodes) {
        const node: ContainerNode = levelNodes.find(ele => ele.objectId === idx[0].id)
        this.treeDef.onNodeClick(node);
        this.treeDef.onNodeExpandedChange(node, true);
        this.treeDef.selectedNode = node;
        this.cdr.markForCheck()
        idx.shift();
        previousNode = node;
      }
    })
  }
}
