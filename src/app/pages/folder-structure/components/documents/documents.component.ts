import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {DocumentsGrid} from "@app/pages/folder-structure/grids/documents.grid";
import {organizoAnimations} from "@organizo/animations/organizo.animations";
import {Store} from "@ngxs/store";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {get} from "lodash-es";
import {OrganizoDrawerComponent} from "@organizo/components/drawer/drawer.component";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {SetDocumentsActionByContainerId} from "@app/pages/folder-structure/store/documents/documents.actions";
import {FolderStructureUtilsService} from "@app/pages/folder-structure/utils/folder-structure-utils.service";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {Permissions} from "@app/pages/security-template/dummy-data/permissions";

@Component({
  selector: 'organizo-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  animations: organizoAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent extends UnsubscribeComponent implements OnInit, OnDestroy, AfterViewInit {

  gridDef: DocumentsGrid = new DocumentsGrid(this.subscriptions);


  selectedClassName: string;

  constructor(
    private store: Store,
    private folderStructureUtilsService: FolderStructureUtilsService,
    private objectUtilsService: ObjectUtilsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  @Input('drawer') set _isTreeOpen(value: OrganizoDrawerComponent) {
    if (value) {
      this.gridDef = new DocumentsGrid(this.subscriptions, value)
    }
  }

  get canViewProperties() {
    return this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.view) ||
      this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.edit) ||
      this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.add) ||
      this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.fullControl)
  }

  get canAddFolder() {
    return this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.add) ||
      this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.classType.createInstance) ||
      this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.fullControl)
  }

  get canAddDocument() {
    return (
      this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.fullControl) ||
      this.objectUtilsService.hasPermission(
        get(this.store.selectSnapshot(FoldersState.selectedNode), 'features'), Permissions.container.add)
    )
  }

  ngOnInit() {
    this.subscriptions.add(
      this.store.select(FoldersState.selectedNode).subscribe(node => {
        this.selectedClassName = get(node, 'name')
      })
    )
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.cdr.detectChanges()
    }, 1000)
  }

  addDocument() {
    this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, null, false)
    this.objectUtilsService.addQueryParams('dialog', 'addDocument').then(() => {
      this.objectUtilsService.addQueryParams('classType', 'Document')
    })
  }

  addFolder() {
    this.folderStructureUtilsService.getAllAPIsForEditProperties(this.subscriptions, null, true)
    this.objectUtilsService.addQueryParams('dialog', 'addFolder').then(() => {
      this.objectUtilsService.addQueryParams('classType', 'Folder')
    })
  }

  viewFolderProperties() {
    const selectedNode = this.store.selectSnapshot(FoldersState.selectedNode);
    this.folderStructureUtilsService.openFolderOrDocumentPropertiesDialog(this.subscriptions, selectedNode)
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(new SetDocumentsActionByContainerId(null))
  }
}
