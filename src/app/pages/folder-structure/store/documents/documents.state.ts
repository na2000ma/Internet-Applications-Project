import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {get, set} from "lodash-es";
import {asapScheduler, tap} from "rxjs";
import {AppHttpResponse} from "@organizo/interceptor/auth/app-http-response";
import {ShowFailedToast, ShowSuccessToast} from "@app/store/app.action";
import {
  AddDocumentAction,
  DeleteDocumentAction,
  DocumentCancelCheckOutAction,
  DocumentCheckInAction,
  DocumentCheckOutAction,
  EditDocumentPropertiesAction,
  EditDocumentTitleAction,
  GetAllClassHierarchical,
  GetAvailableClasses,
  GetAvailableClassificationsByContainerIdForDocument,
  GetAvailableClassificationsForFolder,
  GetAvailableDocumentClasses,
  GetDocumentContentById,
  GetDocumentFolderFieldIn,
  GetDocumentPropertiesAction,
  GetDocumentsActionByContainerId,
  GetDocumentVersions,
  GetTreeDocumentFoldersFieldIn,
  SetAllClassHierarchical,
  SetAvailableClasses,
  SetAvailableClassifications,
  SetAvailableContainers,
  SetAvailableDocumentClasses,
  SetCheckboxFolderFieldIn,
  SetDeletedItemFromGridFolderFieldIn,
  SetDocumentContentById,
  SetDocumentFolderFieldIn,
  SetDocumentProperties,
  SetDocumentsActionByContainerId,
  SetDocumentVersions,
  SetFolderFieldInNode,
  SetFolderFieldInNodeExpanded,
  SetGeneralFormValue,
  SetSelectedDocument,
  SetViewContent
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {FolderStructureService} from "@app/pages/folder-structure/services/folder-structure.service";
import {DocumentModel} from "@app/pages/folder-structure/models/document.model";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {Draft, produce} from "immer";
import {FoldersModel} from "@app/pages/folder-structure/store/folders/folders.state";
import {FolderFieldInNode} from "@app/pages/folder-structure/trees/document-folders-field-in.tree";
import {ActivatedRoute} from "@angular/router";
import {inject} from "@organizo/injector/app-injector";
import {LunchWorkFlowAction} from "@app/pages/inbox/store/inbox.actions";
import {MailboxModel} from "@app/pages/inbox/store/inbox.state";


export interface DocumentsModel {
  documents: Array<DocumentModel>;
  documentContent: { objectId: any, blob: any, byteArray: any };
  selectedDocument: any;
  documentProperties: any;
  viewContent: boolean;
  contentForDownload: any;
  documentForDownload: any;
  documentVersions: any;
  availableClasses: any;
  availableContainers: any;
  allClassHierarchical: any;
  foldersFieldInTree: any;
  availableDocumentClasses: any;
  generalFormValue: any,
  folderFieldIn: any[],
  availableClassificationsForDocument: any[],
  availableClassificationsForFolder: any[],
}

const defaults = {
  documents: null,
  documentContent: null,
  selectedDocument: null,
  documentProperties: null,
  viewContent: null,
  contentForDownload: null,
  documentForDownload: null,
  documentVersions: null,
  availableClasses: null,
  allClassHierarchical: null,
  foldersFieldInTree: null,
  availableContainers: null,
  availableDocumentClasses: null,
  generalFormValue: null,
  folderFieldIn: [],
  getAvailableClassificationsForDocument: [],
  getAvailableClassificationsForFolder: [],
}

@State({
  name: 'documents',
  defaults
})
@Injectable()
export class DocumentsState {


  constructor(
    private service: FolderStructureService,
    private objectUtilsService: ObjectUtilsService
  ) {
  }

  @Selector()
  static documents(state: DocumentsState) {
    return get(state, 'documents') || null;
  }

  @Selector()
  static selectedNode(state: DocumentsState) {
    return get(state, 'selectedNode') || null;
  }

  @Selector()
  static documentContent(state: DocumentsState) {
    return get(state, 'documentContent') || null;
  }

  @Selector()
  static selectedDocument(state: DocumentsState) {
    return get(state, 'selectedDocument') || null;
  }

  @Selector()
  static documentProperties(state: DocumentsState) {
    return get(state, 'documentProperties') || null;
  }

  @Selector()
  static viewContent(state: DocumentsState) {
    return get(state, 'viewContent') || null;
  }

  @Selector()
  static contentForDownload(state: DocumentsState) {
    return get(state, 'contentForDownload') || null;
  }

  @Selector()
  static documentForDownload(state: DocumentsState) {
    return get(state, 'documentForDownload') || null;
  }

  @Selector()
  static documentVersions(state: DocumentsState) {
    return get(state, 'documentVersions') || null;
  }

  @Selector()
  static availableClasses(state: DocumentsState) {
    return get(state, 'availableClasses') || null;
  }

  @Selector()
  static availableContainers(state: DocumentsState) {
    return get(state, 'availableContainers') || null;
  }

  @Selector()
  static allClassHierarchical(state: DocumentsState) {
    return get(state, 'allClassHierarchical') || null;
  }

  @Selector()
  static foldersFieldInTree(state: DocumentsState) {
    return get(state, 'foldersFieldInTree') || null;
  }

  @Selector()
  static availableDocumentClasses(state: DocumentsState) {
    return get(state, 'availableDocumentClasses') || null;
  }

  @Selector()
  static generalFormValue(state: DocumentsState) {
    return get(state, 'generalFormValue') || null;
  }

  @Selector()
  static folderFieldIn(state: DocumentsState) {
    return get(state, 'folderFieldIn') || null;
  }

  @Selector()
  static availableClassificationsForDocument(state: DocumentsState) {
    return get(state, 'availableClassificationsForDocument') || null;
  }

  @Selector()
  static availableClassificationsForFolder(state: DocumentsState) {
    return get(state, 'availableClassificationsForFolder') || null;
  }


  @Action(GetDocumentsActionByContainerId)
  getDocuments({dispatch}: StateContext<DocumentsModel>, {containerId}: GetDocumentsActionByContainerId) {
    return this.service.getByContainerId(containerId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any[]) => {
            dispatch(new SetDocumentsActionByContainerId(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetDocumentsActionByContainerId)
  setDocuments({patchState}: StateContext<DocumentsModel>,
               {payload}: SetDocumentsActionByContainerId) {
    patchState({
      documents: payload
    })
  }

  @Action(GetDocumentContentById)
  getDocumentContentById({dispatch}: StateContext<DocumentsModel>, {id, forDownload}: GetDocumentContentById) {
    return this.service.getDocumentContentById(id).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {

            dispatch(new SetDocumentContentById(data, forDownload));

            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetDocumentContentById)
  setDocumentContentById(
    {patchState}: StateContext<DocumentsModel>,
    {payload, forDownload}: SetDocumentContentById) {
    let key = forDownload ? 'contentForDownload' : 'documentContent'
    if (payload) {
      this.objectUtilsService.decodedContentByBase64(get(payload, 'encodedContent'), forDownload).subscribe(data => {
        if (data) {
          patchState({
            [key]: {
              objectId: get(payload, 'objectId'),
              blob: get(data, 'blob'),
              byteArray: get(data, 'byteArray'),
            }
          })
        }
      })
    } else {
      patchState({
        [key]: payload
      })
    }
  }

  @Action(SetSelectedDocument)
  setSelectedDocument(
    {patchState}: StateContext<DocumentsModel>,
    {payload, forDownload}: SetSelectedDocument) {
    if (forDownload) {
      patchState({
        documentForDownload: payload
      })
    } else {
      patchState({
        selectedDocument: payload
      })
    }
  }

  @Action(GetDocumentPropertiesAction)
  getDocumentPropertiesAction({dispatch}: StateContext<DocumentsModel>, {
    objectId,
    tableName
  }: GetDocumentPropertiesAction) {
    return this.service.getDocumentProperties({objectId, tableName}).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetDocumentProperties(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetDocumentProperties)
  setDocumentProperties(
    {patchState}: StateContext<DocumentsModel>,
    {payload}: SetDocumentContentById) {
    if (payload) {
      patchState({
        documentProperties: this.objectUtilsService.transformDocumentAttributes(payload)
      })
    } else {
      patchState({
        documentProperties: payload
      })
    }
  }

  @Action(SetViewContent)
  setViewContent(
    {patchState}: StateContext<DocumentsModel>,
    {status}: SetViewContent) {
    patchState({
      viewContent: status
    })
  }

  @Action(GetDocumentVersions)
  getDocumentVersions(
    {dispatch}: StateContext<DocumentsModel>,
    {vsId}: GetDocumentVersions) {
    return this.service.getDocumentVersions({vsId}).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetDocumentVersions(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetDocumentVersions)
  setDocumentVersions(
    {patchState}: StateContext<DocumentsModel>,
    {payload}: SetDocumentVersions) {
    patchState({
      documentVersions: payload
    })
  }

  @Action(GetAvailableClasses)
  getAvailableClasses(
    {dispatch}: StateContext<DocumentsModel>,
    {containerId}: GetAvailableClasses) {
    return this.service.getAvailableClasses({containerId}).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetAvailableClasses(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetAvailableClasses)
  setAvailableClasses(
    {patchState}: StateContext<DocumentsModel>,
    {payload}: SetAvailableClasses) {
    patchState({
      availableClasses: payload
    })
  }

  @Action(GetAllClassHierarchical)
  getAllClassHierarchical(
    {dispatch}: StateContext<DocumentsModel>,
    {objectId}: GetAllClassHierarchical) {
    return this.service.getAllClassHierarchical({objectId}).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetAllClassHierarchical(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetAllClassHierarchical)
  setAllClassHierarchical(
    {patchState}: StateContext<DocumentsModel>,
    {payload}: SetAllClassHierarchical) {
    patchState({
      allClassHierarchical: payload
    })
  }


  @Action(SetFolderFieldInNodeExpanded)
  setFolderFieldInNodeExpanded({getState, setState}: StateContext<DocumentsModel>,
                               {currentNode, isExpanded}: SetFolderFieldInNodeExpanded) {
    setState(produce(getState(), (state: Draft<DocumentsModel>) => {
      set(state, `foldersFieldInTree.${currentNode.path}.isExpanded`, isExpanded);
    }));
  }

  @Action(GetAvailableClassificationsForFolder)
  getAvailableClassificationsForFolder({dispatch}: StateContext<DocumentsModel>) {
    return this.service.getAvailableClassificationsForFolder().pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
          dispatch(new SetAvailableClassifications(data, true));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetAvailableContainers)
  setAvailableContainers(
    {patchState}: StateContext<DocumentsModel>,
    {payload}: SetAvailableContainers) {
    patchState({
      availableContainers: payload
    })
  }

  @Action(GetAvailableDocumentClasses)
  getAvailableDocumentClasses({dispatch}: StateContext<DocumentsModel>) {
    return this.service.getAvailableDocumentClasses().pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetAvailableDocumentClasses(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetAvailableDocumentClasses)
  setAllTablesName(
    {patchState}: StateContext<DocumentsModel>,
    {payload}: SetAvailableContainers) {
    patchState({
      availableDocumentClasses: payload
    })
  }

  @Action(SetGeneralFormValue)
  setGeneralFormValue(
    {patchState}: StateContext<DocumentsModel>,
    {payload}: SetGeneralFormValue) {
    patchState({
      generalFormValue: payload
    })
  }

  @Action(DocumentCheckOutAction)
  putDocumentCheckOut({dispatch}: StateContext<DocumentsModel>,
                      {payload, containerId}: DocumentCheckOutAction) {
    return this.service.documentCheckOut(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            dispatch(new GetDocumentsActionByContainerId(containerId));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetDocumentFolderFieldIn)
  setDocumentFolderFieldIn({patchState}: StateContext<DocumentsModel>,
                           {payload}: SetDocumentFolderFieldIn) {
    patchState({
      folderFieldIn: payload
    })
  }

  @Action(GetDocumentFolderFieldIn)
  getDocumentFolderFieldIn({dispatch}: StateContext<DocumentsModel>,
                           {payload}: GetDocumentFolderFieldIn) {
    return this.service.documentFolderFieldIn(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(
          (data: any) => {
            if (data.length > 0) {
              dispatch(new SetDocumentFolderFieldIn(data));
            }
          },

          () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    )
  }

  @Action(SetFolderFieldInNode)
  setFolderFieldInNode({getState, setState}: StateContext<DocumentsModel>,
                       {payload, currentNode}: SetFolderFieldInNode) {
    if (!payload) {
      setState(produce(getState(), (state: Draft<FoldersModel>) => {
        set(state, 'foldersFieldInTree', null);
      }));
      return;
    }
    let activatedRoute = inject(ActivatedRoute);



    payload.forEach((containerNode: FolderFieldInNode, idx: number) => {
      let isChecked: boolean = currentNode ?
        (activatedRoute.snapshot.queryParams['containerId'] == containerNode.objectId): false ;
      containerNode.path = `${currentNode ? currentNode.path + '.children.' : ''}${idx}`;
      containerNode.icon = 'folder';
      containerNode.documentExist = isChecked;
    });
    setState(produce(getState(), (state: Draft<DocumentsModel>) => {
      set(state, currentNode ? `foldersFieldInTree.${currentNode.path}.children` : `foldersFieldInTree`, payload);
    }));

  }

  @Action(GetTreeDocumentFoldersFieldIn)
  getTreeDocumentFoldersFieldIn({dispatch}: StateContext<DocumentsModel>,
                                {payload, currentNode}: GetTreeDocumentFoldersFieldIn) {

    const checkedPayload = {};

    for (const key in payload) {
      if (payload[key] !== undefined && payload[key] !== null) {
        checkedPayload[key] = payload[key];
      }
    }
    return this.service.getFoldersFieldInTree(checkedPayload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(
          data => {
            dispatch(new SetFolderFieldInNode(data, currentNode))
          },
          () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))

          }
        )
      })
    )
  }


  @Action(SetCheckboxFolderFieldIn)
  setCheckboxFolderFieldIn({setState, getState}: StateContext<DocumentModel>,
                           {currentNode, isChecked}: SetCheckboxFolderFieldIn) {
    setState(produce(getState(), (state: Draft<DocumentsModel>) => {
      set(state, `foldersFieldInTree.${currentNode.path}.documentExist`, isChecked);
    }));
  }

  @Action(SetDeletedItemFromGridFolderFieldIn)
  deleteDocumentFolderFieldIn({dispatch, getState}: StateContext<DocumentsModel>,
                              {node}: SetDeletedItemFromGridFolderFieldIn) {
    let newDataSource = getState().folderFieldIn.filter((item) => {
      return get(item, 'objectId') != get(node, 'objectId');
    })

    dispatch(new SetDocumentFolderFieldIn(newDataSource));
    dispatch(new SetCheckboxFolderFieldIn(node, false))
  }

  @Action(GetAvailableClassificationsByContainerIdForDocument)
  getAvailableClassificationsByContainerIdForDocument({dispatch}: StateContext<DocumentsModel>, {containerId}: GetAvailableClassificationsByContainerIdForDocument) {
    return this.service.getAvailableClassificationByContainerIdForDocument(containerId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
          dispatch(new SetAvailableClassifications(data));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetAvailableClassifications)
  setAvailableClassificationsByContainerId({patchState}: StateContext<DocumentsModel>,
                                           {data, forFolder}: SetAvailableClassifications) {
    patchState({
      [forFolder ? 'availableClassificationsForFolder' : 'availableClassificationsForDocument']: data
    })
  }

  @Action(AddDocumentAction)
  addDocumentAction({dispatch}: StateContext<DocumentsModel>, {payload, containerId}: AddDocumentAction) {
    return this.service.addDocument(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            dispatch(new GetDocumentsActionByContainerId(containerId));
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(DocumentCheckInAction)
  documentCheckInAction({dispatch}: StateContext<DocumentsModel>, {payload, containerId}: DocumentCheckInAction) {
    return this.service.documentCheckIn(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            // dispatch(new ShowSuccessToast());
          dispatch(new GetDocumentsActionByContainerId(containerId))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(DocumentCancelCheckOutAction)
  documentCancelCheckOutAction({dispatch}: StateContext<DocumentsModel>, {
    objectId,
    containerId
  }: DocumentCancelCheckOutAction) {
    return this.service.documentCancelCheckOut(objectId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            // dispatch(new ShowSuccessToast());
            dispatch(new GetDocumentsActionByContainerId(containerId))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(EditDocumentPropertiesAction)
  editDocumentPropertiesAction({dispatch}: StateContext<DocumentsModel>, {payload}: EditDocumentPropertiesAction) {
    return this.service.editDocumentProperties(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(EditDocumentTitleAction)
  editDocumentTitleAction({dispatch}: StateContext<DocumentsModel>, {payload, containerId}: EditDocumentTitleAction) {
    return this.service.editDocument(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            // dispatch(new ShowSuccessToast());
            dispatch(new GetDocumentsActionByContainerId(containerId))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(DeleteDocumentAction)
  deleteDocumentAction({dispatch}: StateContext<DocumentsModel>, {
    payload,
    fromAllContainers,
    containerId
  }: DeleteDocumentAction) {
    return this.service.deleteDocument(payload, fromAllContainers).pipe(
      tap((response: AppHttpResponse) => {
        response.handle(() => {
            // dispatch(new ShowSuccessToast());
            dispatch(new GetDocumentsActionByContainerId(containerId))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }


  @Action(LunchWorkFlowAction)
  lunchWorkFlow({dispatch}:StateContext<MailboxModel>,{payload}:LunchWorkFlowAction){
    return this.service.lunchWorkFlow(payload).pipe(
      tap(
        (response: AppHttpResponse) =>{
          response.handle(
            ()=>{
              asapScheduler.schedule(()=> dispatch(new ShowSuccessToast()))
            },
            ()=>{
              asapScheduler.schedule(()=> dispatch(new ShowFailedToast()))
            }
          )
        }
      ))
  }

}
