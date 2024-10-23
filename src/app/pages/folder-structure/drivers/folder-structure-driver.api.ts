import {environment} from "@env/environment";

export const FolderStructureDriverApis = {
  container: {
    getParents: environment.contentEngineURL + 'container/get-parents',
    getParentsById: environment.contentEngineURL + 'container/by-parent-id',
    getPath: environment.contentEngineURL + 'container/path',
    addFolder: environment.contentEngineURL + 'folder/add',
    getFolderProperties: environment.contentEngineURL + 'folder/by-id',
    editFolderProperties: environment.contentEngineURL + 'folder',
    rename: environment.contentEngineURL + 'container/rename',
    availableContainers: environment.contentEngineURL + 'class-definition/available-container',
    delete: environment.contentEngineURL + 'container/delete',
    move: environment.contentEngineURL + 'container/move',
  },
  documents: {
    getDocumentsByContainerId: environment.contentEngineURL + 'document/get-by-container-id',
    getDocumentContentById: environment.contentEngineURL + 'document/fetch-content',
    getDocumentProperties: environment.contentEngineURL + 'document/by-id',
    getDocumentVersions: environment.contentEngineURL + 'document/get-by-vsid',
    documentCheckOut: environment.contentEngineURL + 'document/check-out',
    documentCancelCheckOut: environment.contentEngineURL + 'document/cancel-check-out',
    documentCheckIn: environment.contentEngineURL + 'document/check-in',
    addDocument: environment.contentEngineURL + 'document/add',
    editDocumentProperties: environment.contentEngineURL + 'document',
    editDocument: environment.contentEngineURL + 'document/update-title',
    deleteDocumentFromThisContainer: environment.contentEngineURL + 'document/delete-from-this-container',
    deleteDocumentFromAllContainers: environment.contentEngineURL + 'document',
    lunchWorkFlow: environment.contentEngineURL + 'process/start',

  },
  classDefinition: {
    getAvailableClasses: environment.contentEngineURL + 'class-definition/get-available-class',
    getAvailableClassificationsForDocument: environment.contentEngineURL + 'classification-class/get-available-class',
    getAllClassHierarchical: environment.contentEngineURL + 'class-definition/get-all-class-hierarchical',
    getAvailableDocumentClasses: environment.contentEngineURL + 'class-definition/get-Document-class-id',
    documentFolderFieldIn: environment.contentEngineURL + 'classification-class/get-containers-for-document',
    foldersFieldInTree: environment.contentEngineURL + 'classification-class/folder-tree',
    getAvailableClassificationsForFolder: environment.contentEngineURL + 'classification-class/get-containers-classification',
  },
  template: {
    getTemplateByClassificationId: environment.contentEngineURL + 'classification-class/get-template-by-classification-id',
    getRelatedFields: environment.contentEngineURL + 'property-class/get-related-for-classification',
    getChoiceListByParentId: environment.contentEngineURL + 'choice-list/by-parent-id',
  }

};
