import {ContainerNode} from "@app/pages/folder-structure/trees/container.tree";
import {DynamicTreeNode} from "@app/pages/folder-structure/trees/dynamic.tree";

export class GetParentsAction {
  static readonly type = '[folderStructure] Get Parents'
}

export class GetChildrenByParentIdAction {
  static readonly type = '[folderStructure] Get Children By Parent Id'

  constructor(public payload: any, public node?: ContainerNode) {
  }
}


export class SetTreeAction {
  static readonly type = '[folderStructure] Set Parents'

  constructor(public payload: any, public node?: ContainerNode) {
  }
}


export class SetNodeExpandedAction {
  static readonly type = '[folderStructure] Set Node Expanded'

  constructor(public node: ContainerNode, public isExpanded: boolean) {
  }
}

export class GetPathActionByContainerId {
  static readonly type = '[folderStructure] Get Path By Container Id'

  constructor(public containerId: any) {
  }
}

export class SetPathAction {
  static readonly type = '[folderStructure] Set Path'

  constructor(public payload: any) {
  }
}

export class SetSelectedNodeAction {
  static readonly type = '[folderStructure] Set Selected Node Action'

  constructor(public node: ContainerNode) {
  }
}

export class SetIfCrumbClicked {
  static readonly type = '[folderStructure] Set If Crumb Clicked'

  constructor(public value: boolean) {
  }
}

export class GetTemplateByClassificationIdAction {
  static readonly type = '[folderStructure] Get Template By Classification Id Action'

  constructor(public payload: any) {
  }
}

export class SetTemplateAction {
  static readonly type = '[folderStructure] Set If Crumb Clicked'

  constructor(public data: any) {
  }
}

export class AddFolderAction {
  static readonly type = '[folderStructure] Add Folder Action'

  constructor(public payload: any, public parentId: any, public selectedNode?: ContainerNode) {
  }
}

export class SetNodeIsParentAction {
  static readonly type = '[folderStructure] Set Node Is Parent'

  constructor(public node: ContainerNode, public isParent: boolean) {
  }
}

export class SetNodeNameAction {
  static readonly type = '[folderStructure] Set Node Name'

  constructor(public node: ContainerNode, public name: string) {
  }
}

export class GetFolderPropertiesByIdAction {
  static readonly type = '[folderStructure] Get Folder Properties By Id Action'

  constructor(public payload: any) {
  }
}

export class SetFolderPropertiesByIdAction {
  static readonly type = '[folderStructure] Set Folder Properties By Id Action'

  constructor(public payload: any) {
  }
}

export class EditFolderPropertiesAction {
  static readonly type = '[folderStructure] Edit Folder Properties Action'

  constructor(public payload: any) {
  }
}

export class RenameFolderAction {
  static readonly type = '[folderStructure] Rename Folder Action'

  constructor(public node: any, public payload: any) {
  }
}

export class GetAvailableContainersAction {
  static readonly type = '[folderStructure] Get Available Containers Action'

  constructor(public availableDocumentClassId: any, public containerId: any) {
  }
}

export class SetAvailableContainersAction {
  static readonly type = '[folderStructure] Set Available Containers Action'

  constructor(public data: any) {
  }
}

export class DeleteContainerAction {
  static readonly type = '[folderStructure] Delete Container Action'

  constructor(public selectedNode: any) {
  }
}

export class MoveContainerContentAction {
  static readonly type = '[folderStructure] Move Container Content Action'

  constructor(public node: any, public destinationId: any) {
  }
}

export class GetRelatedFieldsAction {
  static readonly type = '[folderStructure] Get Related Fields Action'

  constructor(public classificationId: any) {
  }
}

export class SetRelatedFieldsAction {
  static readonly type = '[folderStructure] Set Related Fields Action'

  constructor(public relatedFields: any) {
  }
}


// Dynamic Tree Actions

export class SetDynamicTreeByKeyAction {
  static readonly type = '[folderStructure] Set Dynamic Tree Action'

  constructor(public key: string, public payload: any[], public currentNode?: DynamicTreeNode) {
  }
}

export class SetDynamicTreeNodeIsExpandedByKeyAction {
  static readonly type = '[folderStructure] Set Dynamic Tree Node Is Expanded Action'

  constructor(public key: string, public node: DynamicTreeNode, public isExpanded: boolean) {
  }
}

export class SetDynamicTreeNodeIsCheckedByKeyAction {
  static readonly type = '[folderStructure] Set Dynamic Tree Node Is Checked Action'

  constructor(public key: string, public node: DynamicTreeNode, public isChecked: boolean) {
  }
}

export class GetDynamicTreeByParentIdAndKeyAction {
  static readonly type = '[choiceLists] Get Dynamic Tree By Parent Id Action'

  constructor(public key: string, public parentId?: any, public currentNode?: DynamicTreeNode) {
  }
}

export class SetArrayByKey {
  static readonly type = '[choiceLists] Set Array By Key';
  constructor(public key: string, public value: any[]) {}
}



