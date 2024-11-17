import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {MatDialog} from "@angular/material/dialog";
import {GetAcceptedFilesAction} from "@app/pages/folders/store/folders.actions";
import {FilesGrid} from "@app/pages/folders/grids/files.grid";
import {LocationStrategy} from "@angular/common";
import {AddFolderDialogComponent} from "@app/pages/folders/components/add-folder-dialog/add-folder-dialog.component";


@Component({
  selector: 'organizo-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  gridDef = new FilesGrid();


  constructor(
    private store: Store,
    private locationStrategy: LocationStrategy,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new GetAcceptedFilesAction());
  }


  openAddFileDialog() {
    this.matDialog.open(AddFolderDialogComponent, {
      panelClass: [
        "h-[40vh]", "w-[50vw]"
      ],
      enterAnimationDuration: '0.4s',
      exitAnimationDuration: '200ms'
    })
  }

  back() {
    this.locationStrategy.back()
  }
}
