import {DatePipe} from '@angular/common';
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {get} from "lodash-es";
import {OrganizoScrollResetDirective} from "@organizo/directives/scroll-reset/scroll-reset.directive";
import {inject} from "@organizo/injector/app-injector";
import {MatDialog} from "@angular/material/dialog";
import {lastValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {
  DispatchTaskDialogComponent
} from "@app/pages/inbox/components/dialogs/dispatch-task-dialog/dispatch-task-dialog.component";
import {GetUsersAndSecretary} from "@app/pages/inbox/store/inbox.actions";
import {InboxState} from "@app/pages/inbox/store/inbox.state";

@Component({
  selector: 'inbox-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, DatePipe, OrganizoScrollResetDirective],
})

export class InboxDetailsComponent implements OnInit {
  @Input() selectedTask!: any;

  protected readonly get = get;


  constructor(private store: Store) {
  }


  ngOnInit(): void {
  }


  async openDispatchDialog() {

    await lastValueFrom(this.store.dispatch(new GetUsersAndSecretary()));

    inject(MatDialog).open(DispatchTaskDialogComponent, {
      panelClass: [
        "h-[90vh]", "w-[50vw]", "max-sm:w-full", "max-sm:h-[70vh]", "max-[1200px]:w-[50vw]",
      ],
      data: {
        users: this.store.selectSnapshot(InboxState.users),
        selectedTask: this.selectedTask
      }
    })
  }
}
