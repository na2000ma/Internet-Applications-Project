import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FolderStructureDriverApis} from "@app/pages/folder-structure/drivers/folder-structure-driver.api";
import {get} from "lodash-es";

@Injectable({
  providedIn: 'root'
})
export class FolderStructureService {

  constructor(private httpClient: HttpClient) {
  }

  getParents() {
    return this.httpClient.get(FolderStructureDriverApis.container.getParents);
  }

  getParentsById(payload: any) {
    return this.httpClient.get(FolderStructureDriverApis.container.getParentsById, {
      params: {
        parentId: get(payload, "parentId")
      }
    })
  }

  getByContainerId(containerId: any) {
    return this.httpClient.get(FolderStructureDriverApis.documents.getDocumentsByContainerId, {
      params: {
        objectId: containerId
      }
    })
  }

  getPath(containerId: any) {
    return this.httpClient.get(FolderStructureDriverApis.container.getPath, {
      params: {
        containerId: containerId
      }
    })
  }

  getDocumentContentById(id: any) {
    return this.httpClient.get(FolderStructureDriverApis.documents.getDocumentContentById, {
      params: {
        objectId: id
      }
    })
  }

  getDocumentProperties({objectId, tableName}: any) {
    return this.httpClient.get(FolderStructureDriverApis.documents.getDocumentProperties, {
      params: {
        objectId: objectId,
        tableName: tableName
      }
    })
  }

  getDocumentVersions({vsId}: any) {
    return this.httpClient.get(FolderStructureDriverApis.documents.getDocumentVersions, {
      params: {
        vsid: vsId
      }
    })
  }

  getAvailableClasses({containerId}: any) {
    return this.httpClient.get(FolderStructureDriverApis.classDefinition.getAvailableClasses, {
      params: {
        containerId: containerId
      }
    })
  }

  getAvailableClassificationsForFolder() {
    return this.httpClient.get(FolderStructureDriverApis.classDefinition.getAvailableClassificationsForFolder)
  }

  getAllClassHierarchical({objectId}: any) {
    return this.httpClient.get(FolderStructureDriverApis.classDefinition.getAllClassHierarchical, {
      params: {
        objectId: objectId
      }
    })
  }

  getAvailableDocumentClasses() {
    return this.httpClient.get(FolderStructureDriverApis.classDefinition.getAvailableDocumentClasses)
  }

  documentCheckOut(payload: any) {
    return this.httpClient.put(FolderStructureDriverApis.documents.documentCheckOut, {}, {
        params: {
          objectId: payload
        }
      }
    )
  }

  documentFolderFieldIn(payload: any) {
    return this.httpClient.get(FolderStructureDriverApis.classDefinition.documentFolderFieldIn, {
      params: {
        documentId: payload,
      }
    })
  }

  getFoldersFieldInTree(payload: any) {
    return this.httpClient.get(FolderStructureDriverApis.classDefinition.foldersFieldInTree, {
      params: {
        ...payload
      }
    })
  }

  getAvailableClassificationByContainerIdForDocument(containerId: any) {
    return this.httpClient.get(FolderStructureDriverApis.classDefinition.getAvailableClassificationsForDocument, {
      params: {containerId}
    })
  }

  getTemplateByClassificationId(payload: any) {
    return this.httpClient.get(FolderStructureDriverApis.template.getTemplateByClassificationId, {
      params: {...payload}
    })
  }

  addDocument(payload: any) {
    return this.httpClient.post(FolderStructureDriverApis.documents.addDocument, {...payload})
  }

  addFolder(payload: any) {
    return this.httpClient.post(FolderStructureDriverApis.container.addFolder, {...payload})
  }

  getFolderPropertiesById(payload: any) {
    return this.httpClient.get(FolderStructureDriverApis.container.getFolderProperties, {
      params: {...payload}
    })
  }

  editFolderProperties(payload: any) {
    return this.httpClient.put(FolderStructureDriverApis.container.editFolderProperties, {...payload})
  }

  editDocumentProperties(payload: any) {
    return this.httpClient.put(FolderStructureDriverApis.documents.editDocumentProperties, {...payload})
  }

  editDocument(payload: any) {
    return this.httpClient.put(FolderStructureDriverApis.documents.editDocument, {...payload})
  }

  documentCheckIn(payload: any) {
    return this.httpClient.put(FolderStructureDriverApis.documents.documentCheckIn, {...payload})
  }

  documentCancelCheckOut(objectId: any) {
    return this.httpClient.put(FolderStructureDriverApis.documents.documentCancelCheckOut, {}, {
      params: {objectId}
    })
  }

  deleteDocument(payload: any, fromAllContainers: boolean) {
    return this.httpClient.delete(
      fromAllContainers ?
        FolderStructureDriverApis.documents.deleteDocumentFromAllContainers :
        FolderStructureDriverApis.documents.deleteDocumentFromThisContainer,
      {
        body: {...payload}
      }
    )
  }

  rename(payload: any) {
    return this.httpClient.put(FolderStructureDriverApis.container.rename, {...payload})
  }

  getAvailableContainers(availableDocumentClass: any, containerId: any) {
    return this.httpClient.get(FolderStructureDriverApis.container.availableContainers, {
      params: {
        availableDocumentClass: availableDocumentClass,
        containerId: containerId
      }
    })
  }

  deleteContainerById(containerId: any) {
    return this.httpClient.delete(FolderStructureDriverApis.container.delete, {params: {containerId}})
  }

  moveContainerContent(starting: any, destination: any) {
    return this.httpClient.put(FolderStructureDriverApis.container.move, {}, {
      params: {
        starting: starting,
        destination: destination
      }
    })
  }

  getRelatedFields(classificationId: any) {
    return this.httpClient.get(FolderStructureDriverApis.template.getRelatedFields, {params: {classificationId}})
  }

  getChoiceListsByParentId(parentId: any) {
    return this.httpClient.get(FolderStructureDriverApis.template.getChoiceListByParentId, {params: {parentId}})
  }

  lunchWorkFlow(payload: any) {
    return this.httpClient.post(FolderStructureDriverApis.documents.lunchWorkFlow, payload, {
      params: {
        processKey: 'users-loop'    // This is static only for test at beginning
      }
    })
  }
}
