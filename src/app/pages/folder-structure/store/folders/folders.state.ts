import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {get, set} from "lodash-es";
import {ContainerNode} from "@app/pages/folder-structure/trees/container.tree";
import {asapScheduler, tap} from "rxjs";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {ShowFailedToast} from "@app/store/app.action";
import {Draft, produce} from "immer";
import {
  AddFolderAction,
  DeleteContainerAction,
  EditFolderPropertiesAction,
  GetAvailableContainersAction,
  GetChildrenByParentIdAction, GetDynamicTreeByParentIdAndKeyAction,
  GetFolderPropertiesByIdAction,
  GetParentsAction,
  GetPathActionByContainerId,
  GetRelatedFieldsAction,
  GetTemplateByClassificationIdAction,
  MoveContainerContentAction,
  RenameFolderAction, SetArrayByKey,
  SetAvailableContainersAction,
  SetDynamicTreeByKeyAction,
  SetDynamicTreeNodeIsCheckedByKeyAction,
  SetDynamicTreeNodeIsExpandedByKeyAction,
  SetFolderPropertiesByIdAction,
  SetIfCrumbClicked,
  SetNodeExpandedAction,
  SetNodeIsParentAction,
  SetNodeNameAction,
  SetPathAction,
  SetRelatedFieldsAction,
  SetSelectedNodeAction,
  SetTemplateAction,
  SetTreeAction
} from "@app/pages/folder-structure/store/folders/folders.actions";
import {FolderStructureService} from "@app/pages/folder-structure/services/folder-structure.service";
import {Crumb} from "@organizo/models/crumb";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import { DynamicTreeNode } from "../../trees/dynamic.tree";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";

export interface FoldersModel {
  tree: Array<ContainerNode>;
  path: Array<Crumb>;
  selectedNode: ContainerNode;
  isCrumbClicked: boolean;
  template: any[];
  folderProperties: any;
  availableContainers: any[];
  relatedFields: any[];
  dynamicTree: { [key: string]: Array<DynamicTreeNode> };
}

const defaults = {
  tree: [],
  path: null,
  selectedNode: null,
  isCrumbClicked: false,
  template: [],
  folderProperties: {},
  availableContainers: null,
  relatedFields: null,
  dynamicTree: null
}

@State({
  name: 'folders',
  defaults
})
@Injectable()
export class FoldersState {


  constructor(
    private service: FolderStructureService,
    private objectUtilsService: ObjectUtilsService,
    private folderStructureUtilsService: FolderStructureUtilsService
  ) {
  }

  @Selector()
  static tree(state: FoldersState) {
    return get(state, 'tree') || [];
  }

  @Selector()
  static path(state: FoldersState) {
    return get(state, 'path') || null;
  }

  @Selector()
  static selectedNode(state: FoldersState) {
    return get(state, 'selectedNode') || null;
  }

  @Selector()
  static isCrumbClicked(state: FoldersState) {
    return get(state, 'isCrumbClicked') || null;
  }

  @Selector()
  static template(state: FoldersState) {
    return get(state, 'template') || null;
  }

  @Selector()
  static relatedFields(state: FoldersState) {
    return get(state, 'relatedFields') || null;
  }

  @Selector()
  static folderProperties(state: FoldersState) {
    return get(state, 'folderProperties') || null;
  }

  @Selector()
  static availableContainers(state: FoldersState) {
    return get(state, 'availableContainers') || null;
  }

  // Selector to get data by key
  @Selector()
  static dynamicTreeByKey(key: string) {
    return (state: FoldersState) => get(state, `folders.dynamicTree.${key}`) || null;
  }


  @Action(GetParentsAction)
  getParentsAction({dispatch}: StateContext<FoldersModel>) {
    return this.service.getParents().pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetTreeAction(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(GetChildrenByParentIdAction)
  getChildrenByParentIdAction({dispatch}: StateContext<FoldersModel>, {
    payload,
    node
  }: GetChildrenByParentIdAction) {
    return this.service.getParentsById(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetTreeAction(data, node));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  // ToDo...
  @Action(SetTreeAction)
  setTreeActions({getState, setState}: StateContext<FoldersModel>,
                 {payload, node}: SetTreeAction) {
    if (!payload) {
      setState(produce(getState(), (state: Draft<FoldersModel>) => {
        set(state, 'tree', null);
      }));
      return;
    }
    payload.forEach((containerNode: ContainerNode, idx: number) => {
      containerNode.path = `${node ? node.path + '.children.' : ''}${idx}`;
      containerNode.icon = 'folder'
    });
    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, node ? `tree.${node.path}.children` : `tree`, payload);
    }));
  }


  @Action(SetNodeExpandedAction)
  setNodeExpandedAction({getState, setState}: StateContext<FoldersModel>,
                        {node, isExpanded}: SetNodeExpandedAction) {
    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, `tree.${node.path}.isExpanded`, isExpanded);
    }));
  }

  @Action(SetNodeIsParentAction)
  setNodeIsParentAction({getState, setState}: StateContext<FoldersModel>,
                        {node, isParent}: SetNodeIsParentAction) {
    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, `tree.${node.path}.isParent`, isParent);
    }));
  }

  @Action(SetNodeNameAction)
  setNodeNameAction({getState, setState}: StateContext<FoldersModel>,
                    {node, name}: SetNodeNameAction) {
    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, `tree.${node.path}.name`, name);
    }));
  }

  @Action(GetPathActionByContainerId)
  getPath({dispatch}: StateContext<FoldersModel>, {containerId}: GetPathActionByContainerId) {
    return this.service.getPath(containerId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            data = data.map((item: any) => {
              return {...item, type: 'folder'};
            });
            dispatch(new SetPathAction(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetPathAction)
  setPath({patchState}: StateContext<FoldersModel>,
          {payload}: SetPathAction) {
    patchState({
      path: payload
    })
  }

  @Action(SetSelectedNodeAction)
  setSelectedNodeAction({patchState}: StateContext<FoldersModel>,
                        {node}: SetSelectedNodeAction) {
    patchState({
      selectedNode: node
    })
  }

  @Action(SetIfCrumbClicked)
  setIfCrumbClicked({patchState}: StateContext<FoldersModel>,
                    {value}: SetIfCrumbClicked) {
    patchState({
      isCrumbClicked: value
    })
  }

  @Action(GetTemplateByClassificationIdAction)
  getTemplateByClassificationIdAction({dispatch}: StateContext<FoldersModel>, {payload}: GetTemplateByClassificationIdAction) {
    return this.service.getTemplateByClassificationId(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetTemplateAction(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetTemplateAction)
  setTemplateAction({patchState}: StateContext<FoldersModel>,
                    {data}: SetTemplateAction) {
    patchState({
      template: data
    })
  }

  @Action(AddFolderAction)
  addFolderAction({dispatch}: StateContext<FoldersModel>, {payload, parentId, selectedNode}: AddFolderAction) {
    return this.service.addFolder(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            if (selectedNode) {
              if (parentId) {
                dispatch(new GetChildrenByParentIdAction({parentId: parentId}, selectedNode));
              } else {
                dispatch(new GetParentsAction())
              }
              dispatch([
                new SetNodeIsParentAction(selectedNode, true),
                new SetNodeExpandedAction(selectedNode, true)
              ])
            } else {
              dispatch(new GetParentsAction())
            }
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(GetFolderPropertiesByIdAction)
  getFolderPropertiesByIdAction({dispatch}: StateContext<FoldersModel>, {payload}: GetFolderPropertiesByIdAction) {
    return this.service.getFolderPropertiesById(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            // dispatch(new ShowSuccessToast());
            dispatch(new SetFolderPropertiesByIdAction(data))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetFolderPropertiesByIdAction)
  setFolderPropertiesByIdAction({patchState}: StateContext<FoldersModel>,
                                {payload}: SetFolderPropertiesByIdAction) {
    if (payload) {
      patchState({
        folderProperties: this.objectUtilsService.transformDocumentAttributes(payload)
      })
    } else {
      patchState({
        folderProperties: payload
      })
    }
  }

  @Action(EditFolderPropertiesAction)
  editFolderPropertiesAction({dispatch}: StateContext<FoldersModel>, {payload}: EditFolderPropertiesAction) {
    return this.service.editFolderProperties(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {

          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(RenameFolderAction)
  renameFolderAction({dispatch}: StateContext<FoldersModel>, {node, payload}: RenameFolderAction) {
    return this.service.rename(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            // dispatch(new ShowSuccessToast());
            dispatch(new SetNodeNameAction(node, get(payload, 'name')))
            // dispatch(new SetSelectedNodeAction(payload))
            dispatch(new GetPathActionByContainerId(get(payload, 'containerId')))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(GetAvailableContainersAction)
  getAvailableContainersAction({dispatch}: StateContext<FoldersModel>, {
    availableDocumentClassId,
    containerId
  }: GetAvailableContainersAction) {
    return this.service.getAvailableContainers(availableDocumentClassId, containerId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data) => {
            dispatch(new SetAvailableContainersAction(data))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetAvailableContainersAction)
  setAvailableContainersAction({patchState}: StateContext<FoldersModel>, {data}: SetAvailableContainersAction) {
    patchState({
      availableContainers: data
    })
  }

  @Action(DeleteContainerAction)
  deleteContainerAction({dispatch}: StateContext<FoldersModel>, {selectedNode}: DeleteContainerAction) {
    return this.service.deleteContainerById(selectedNode.objectId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            if (selectedNode.parent) {
              dispatch(new GetChildrenByParentIdAction({parentId: selectedNode.parent.objectId}, selectedNode));
            } else {
              dispatch(new GetParentsAction())
            }
            dispatch([
              new SetNodeIsParentAction(selectedNode, true),
              new SetNodeExpandedAction(selectedNode, true)
            ])
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(MoveContainerContentAction)
  moveContainerContentAction(
    {dispatch}: StateContext<FoldersModel>, {node, destinationId}: MoveContainerContentAction) {
    return this.service.moveContainerContent(node.objectId, destinationId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            if (node.parent) {
              dispatch(new GetChildrenByParentIdAction({parentId: node.parent.objectId}, node));
            } else {
              dispatch(new GetParentsAction())
            }
            dispatch([
              new SetNodeIsParentAction(node, true),
              new SetNodeExpandedAction(node, true)
            ])
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(GetRelatedFieldsAction)
  getRelatedFieldsAction(
    {dispatch}: StateContext<FoldersModel>, {classificationId}: GetRelatedFieldsAction) {
    return this.service.getRelatedFields(classificationId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data) => {
            dispatch(new SetRelatedFieldsAction(data))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetRelatedFieldsAction)
  setRelatedFieldsAction({patchState}: StateContext<FoldersModel>, {relatedFields}: SetRelatedFieldsAction) {
    patchState({relatedFields})
  }

  // Dynamic Tree Actions

  @Action(SetDynamicTreeByKeyAction)
  setDynamicTreeAction(
    {setState, getState}: StateContext<FoldersModel>,
    {payload, currentNode, key}: SetDynamicTreeByKeyAction) {
    let arr: Array<any> = [];

    if (payload) {
      payload.forEach((e: any, idx: number) => {
        const updatedElement = {
          ...e,
          parent: currentNode,
          path: `${currentNode ? currentNode.path + '.children.' : ''}${idx}`,
          isChecked: false
        };
        arr.push(updatedElement);
      });
    }


    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, currentNode ? `dynamicTree.${key}.${currentNode.path}.children` : `dynamicTree.${key}`, arr);
    }));

  }

  @Action(SetDynamicTreeNodeIsCheckedByKeyAction)
  setDynamicTreeNodeIsCheckedAction(
    {getState, setState}: StateContext<FoldersModel>,
    {key, node, isChecked}: SetDynamicTreeNodeIsCheckedByKeyAction) {

    const oldItems = getState().dynamicTree[key] || [];
    const unCheckedItems = this.folderStructureUtilsService.setAllCheckedFalse(oldItems)

    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, `dynamicTree.${key}`, unCheckedItems);
    }));

    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, `dynamicTree.${key}.${node.path}.isChecked`, isChecked);
    }));

  }

  @Action(SetDynamicTreeNodeIsExpandedByKeyAction)
  setDynamicTreeNodeIsExpandedAction(
    {getState, setState}: StateContext<FoldersModel>,
    {key, node, isExpanded}: SetDynamicTreeNodeIsExpandedByKeyAction) {

    setState(produce(getState(), (state: Draft<FoldersModel>) => {
      set(state, `dynamicTree.${key}.${node.path}.isExpanded`, isExpanded);
    }));
  }

  @Action(GetDynamicTreeByParentIdAndKeyAction)
  getDynamicTreeByParentIdAction(
    {dispatch}: StateContext<FoldersModel>,
    {key, parentId, currentNode}: GetDynamicTreeByParentIdAndKeyAction) {

    const api = this.service.getChoiceListsByParentId(parentId)
    return api.pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any[]) => {
            let newData = data.map(item => {
              return {
                ...item,
                icon: !!get(item, 'isParent') ? 'choice-list' : 'leaf'
              }
            })
            dispatch(new SetDynamicTreeByKeyAction(key, newData, currentNode));
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );

  }

  @Action(SetArrayByKey)
  setArrayByKey(ctx: StateContext<FoldersModel>, action: SetArrayByKey) {
    const state = ctx.getState();
    const updatedMap = {
      ...state.dynamicTree,
      [action.key]: action.value.map((item: any, index: number) => {
        return {
          ...item,
          path: `${index}`
        }
      })
    };
    ctx.patchState({dynamicTree: updatedMap});
  }


}
