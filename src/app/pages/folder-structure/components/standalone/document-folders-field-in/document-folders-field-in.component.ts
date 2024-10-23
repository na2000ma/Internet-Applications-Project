import {Component, Input, OnDestroy,} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {DocumentFoldersFieldInGrid} from "@app/pages/folder-structure/grids/document-folders-field-in.grid";
import {MatDialog} from "@angular/material/dialog";
import {
  AddEditFoldersFieldInDialogComponent
} from "@app/pages/folder-structure/components/standalone/document-folders-field-in/add-edit-folders-field-in-dialog/add-edit-folders-field-in-dialog.component";
import {Store} from "@ngxs/store";
import {
  SetCheckboxFolderFieldIn,
  SetDocumentFolderFieldIn
} from "@app/pages/folder-structure/store/documents/documents.actions";
import {get} from "lodash-es";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";


@Component({
  selector: 'organizo-document-folders-field-in',
  templateUrl: './document-folders-field-in.component.html',
  styleUrl: './document-folders-field-in.component.scss',
  imports: [
    TranslateModule,
    MatButton,
    GridsModule
  ],
  standalone: true
})
export class DocumentFoldersFieldInComponent implements OnDestroy {

  classificationId: any;
  editMode : boolean = false;
  gridDef: DocumentFoldersFieldInGrid = new DocumentFoldersFieldInGrid();
  selectedNodeFromFolder: any;
  gridFolderFieldIn : any;
  treeItemFieldIn: any;

  constructor(private matDialog: MatDialog, private store: Store) {
  }

  @Input('classificationId') set _classificationId(value: any) {
    if (value) {
      this.classificationId = get(value, 'classification');
    }

  }

  @Input('editMode') set _editMode(value:any){
    if(value){
      this.editMode = value;
    }
  }

  openDialogFolderFieldIn() {

    this.matDialog.open(AddEditFoldersFieldInDialogComponent, {
      panelClass: [
        "h-[90vh]", "w-[30vw]", "max-sm:w-full", "max-sm:h-[70vh]", "max-[1200px]:w-[50vw]",
        "absolute", "max-sm:bottom-[4.5vh]", "bottom-[2vh]",
        "ltr:left-[55vw]", "rtl:right-[55vw]"
      ],
       data: {
        classificationId: this.classificationId,
         editMode : this.editMode
      }
    })

    this.treeItemFieldIn = this.store.selectSnapshot(DocumentsState.foldersFieldInTree);

      if(this.editMode){
        if(this.treeItemFieldIn){
         this.gridFolderFieldIn = this.store.selectSnapshot(DocumentsState.folderFieldIn);
         this.gridFolderFieldIn.forEach(gridItem=> {
           this.treeItemFieldIn.forEach(treeItem =>{
             if(gridItem.objectId == treeItem.objectId){
               this.store.dispatch(new SetCheckboxFolderFieldIn(treeItem,true));
             }
           })
         })
        }
      }
      else{
        // Make the initial item checked
        // Here will be only one level because in onExpand we will request to get the children
        if(this.treeItemFieldIn){
          this.selectedNodeFromFolder = this.store.selectSnapshot(FoldersState.selectedNode);
          this.treeItemFieldIn.forEach(item=>{
            if(item.objectId == get(this.selectedNodeFromFolder,'objectId')){
              this.store.dispatch(new SetCheckboxFolderFieldIn(item,true));
              return;
            }
          })
        }
      }

  }


  ngOnDestroy() {
    this.store.dispatch(new SetDocumentFolderFieldIn(null));
  }


}
