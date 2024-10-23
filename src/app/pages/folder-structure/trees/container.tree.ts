import {inject} from "@organizo/injector/app-injector";
import {get} from "lodash-es";
import {TreeDefinition} from "@organizo/tree/definition/tree-definition";
import {lastValueFrom, Observable, Subscription} from "rxjs";
import {Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {MatMenuConfig} from "@organizo/tree/models/mat-menu";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {
  DeleteContainerAction,
  GetAvailableContainersAction,
  GetChildrenByParentIdAction,
  GetPathActionByContainerId,
  MoveContainerContentAction,
  SetNodeExpandedAction,
  SetSelectedNodeAction
} from "@app/pages/folder-structure/store/folders/folders.actions";
import {
  GetDocumentsActionByContainerId,
  SetDocumentsActionByContainerId
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {Permissions} from "@app/pages/security-template/dummy-data/permissions";
import {MatDialog} from "@angular/material/dialog";
import {
  RenameFolderDialogComponent
} from "@app/pages/folder-structure/components/rename-folder-dialog/rename-folder-dialog.component";
import {
  DeleteFolderDialogComponent
} from "@app/pages/folder-structure/components/delete-folder-dialog/delete-folder-dialog.component";
import {OrganizoConfirmationService} from "@organizo/services/confirmation/confirmation.service";

export interface ContainerNode {
  objectId: any;
  name: string;
  icon: 'folder';
  isParent: boolean;
  parent: ContainerNode;
  children: Array<ContainerNode>;
  features: any[];
  isExpanded: boolean;
  path: string;
  availableDocumentClass: any;
}

export class ContainerTree extends TreeDefinition<ContainerNode> {
  subs: Subscription = new Subscription();
  store = inject(Store);
  objectUtilsService = inject(ObjectUtilsService);
  folderStructureUtilsService = inject(FolderStructureUtilsService);
  matDialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  organizoConfirmationService = inject(OrganizoConfirmationService);

  override dataSource: Array<ContainerNode> | Observable<Array<ContainerNode>> = inject(Store).select(FoldersState.tree);
  override matMenu: Array<MatMenuConfig<ContainerNode>> = [
    {
      name: 'folderStructure.addFolder',
      onClick: async (node) => {
        await lastValueFrom(this.store.dispatch(new SetSelectedNodeAction(node)))
        this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subs, null, true)
        this.objectUtilsService.addQueryParams('dialog', 'addFolder').then(() => {
          this.objectUtilsService.addQueryParams('classType', 'Folder')
        })
      },
      hidden: node => {
        return !(this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.add) ||
          this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.classType.createInstance) ||
          this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.fullControl))
      },
      icon: 'add-folder'
    },
    {
      name: 'folderStructure.addDocument',
      onClick: async node => {
        await lastValueFrom(this.store.dispatch(new SetSelectedNodeAction(node)))
        this.objectUtilsService
          .addQueryParams('containerId', get(node, 'objectId'))
          .then(() => {
            this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subs, null, false)
            this.objectUtilsService.addQueryParams('dialog', 'addDocument').then(() => {
              this.objectUtilsService.addQueryParams('classType', 'Document')
            })
          })
      },
      hidden: node => {
        return !(this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.fullControl) ||
          this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.classType.createInstance)
        )
      },
      icon: 'add-document',
    },
    {
      name: 'folderStructure.viewFolderProperty',
      onClick: async node => {
        await lastValueFrom(this.store.dispatch(new SetSelectedNodeAction(node)))
        this.folderStructureUtilsService.openFolderOrDocumentPropertiesDialog(this.subs, node)
      },
      hidden: node => {
        return !(this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.view) ||
          this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.fullControl))
      },
      icon: 'view-folder-property',
    },
    {
      name: 'app.rename',
      onClick: async node => {
        await lastValueFrom(this.store.dispatch(new SetSelectedNodeAction(node)))
        this.matDialog.open(RenameFolderDialogComponent, {
          panelClass: [
            "h-[40vh]", "w-[50vw]"
          ],
          enterAnimationDuration: '0.4s',
          exitAnimationDuration: '200ms',
          data: node
        })
      },
      hidden: node => {
        return !(this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.edit) ||
          this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.fullControl))
      },
      icon: 'edit',
    },
    {
      name: 'app.delete',
      onClick: async node => {
        let confirmationConfig: any = {
          title: 'Delete Container',
          message: `Are you sure you want to Delete this ${node.name} Container and its content?`,
          actions: {
            confirm: {
              label: 'Confirm',
            },
          }
        }

        await lastValueFrom(this.store.dispatch(new GetAvailableContainersAction(get(node, 'availableDocumentClass.objectId'), get(node, 'objectId'))))

        this.matDialog.open(DeleteFolderDialogComponent, {
          panelClass: [
            "h-[50vh]", "w-[50vw]"
          ],
          enterAnimationDuration: '0.4s',
          exitAnimationDuration: '200ms'
        }).afterClosed().subscribe(data => {
          if (data) {
            if (get(data, 'availableContainers')) {
              confirmationConfig = {
                ...confirmationConfig,
                message: `Are you sure you want to Delete this ${node.name} Container and Move its content to the selected container?`
              }
            }
            const confirmation = this.organizoConfirmationService.open(confirmationConfig)
            confirmation.afterClosed().subscribe(async (result) => {
              if (result !== 'confirmed') return;
              else {
                if (get(data, 'availableContainers')) {
                  await lastValueFrom(this.store.dispatch(new MoveContainerContentAction(node, get(data, 'availableContainers'))))
                } else {
                  await lastValueFrom(this.store.dispatch(new DeleteContainerAction(node)))
                }
              }
            });
          }
        })
      },
      hidden: node => false,
      icon: 'trash',
    },
  ];

  constructor(subs: Subscription) {
    super();
    this.subs = subs;
  }

  override customizeId(node: ContainerNode): any {
    return get(node, "objectId");
  }

  override customizeText(node: ContainerNode): string {
    return get(node, "name");
  }

  override customizeHasChildren(node: ContainerNode): boolean {
    return get(node, "isParent");
  }

  override async onNodeClick(node: ContainerNode) {
    if (this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.view) ||
      this.objectUtilsService.hasPermission(get(node, 'features'), Permissions.container.fullControl)
    ) {
      await lastValueFrom(this.store.dispatch(new SetSelectedNodeAction(node)))
      this.store.dispatch(new GetDocumentsActionByContainerId(node.objectId))
      this.store.dispatch(new GetPathActionByContainerId(node.objectId));
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: {containerId: node.objectId, access: null},
          queryParamsHandling: "merge"
        }
      )
    } else {
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: {access: 'denied'},
          queryParamsHandling: "merge"
        }
      ).then(value => {
        if (value) {
          this.store.dispatch(new SetDocumentsActionByContainerId(null))
        }
      })
    }
  }

  override onNodeExpandedChange(node: ContainerNode, expanded: boolean) {
    if (this.customizeHasChildren(node) && !this.customizeChildren(node)) {
      this.store.dispatch(new GetChildrenByParentIdAction({parentId: node.objectId}, node));
    }
    this.store.dispatch(new SetNodeExpandedAction(node, expanded));
  }
}
