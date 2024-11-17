import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {GetAllGroupsAction, GetAllMyGroupsAction, GetAllUsersAction} from "@app/pages/groups/store/groups.actions";
import {GroupsGrid} from "@app/pages/groups/grids/groups.grid";
import {MatDialog} from "@angular/material/dialog";
import {AddGroupDialogComponent} from "@app/pages/groups/components/add-group-dialog/add-group-dialog.component";
import {get} from "lodash-es";

@Component({
  selector: 'organizo-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  gridDef = new GroupsGrid();


  constructor(
    private store: Store,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new GetAllGroupsAction());
  }

  openAddGroupDialog() {
    this.store.dispatch(new GetAllUsersAction()).subscribe({
      complete: () => {
        this.matDialog.open(AddGroupDialogComponent, {
          panelClass: [
            "h-[40vh]", "w-[50vw]"
          ],
          enterAnimationDuration: '0.4s',
          exitAnimationDuration: '200ms'
        })
      }
    });
  }

  onFilterChange(event: any) {
    this.store.dispatch(
      get(event, 'checked') ?  new GetAllMyGroupsAction() : new GetAllGroupsAction()
    )
  }
}
