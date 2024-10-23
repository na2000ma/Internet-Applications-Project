import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {get} from "lodash-es";
import {AuthState} from "@app/pages/auth/store/auth.state";
import {MainPageComponent} from "@app/pages/inbox/components/main-page/main-page.component";
import {GetTasks, SetTasks} from "@app/pages/inbox/store/inbox.actions";
import {InboxState} from "@app/pages/inbox/store/inbox.state";

@Component({
  selector: 'inbox-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class InboxListComponent implements OnInit, OnDestroy {
  @ViewChild('mailList') mailList: ElementRef;

  tasks: any[];
  selectedTask: any;

  protected readonly get = get;

  constructor(
    public mailboxComponent: MainPageComponent,
    private store: Store
  ) {

  }

  ngOnInit(): void {

    const currentUser = this.store.selectSnapshot(AuthState.authUser);

    this.store.dispatch(new GetTasks(get(currentUser, 'loginName')));
    this.store.select(InboxState.tasks).subscribe(data => {
      this.tasks = data
    })
  }


  onTaskSelected(task: any) {
    this.selectedTask = task;
  }

  ngOnDestroy() {
    this.store.dispatch(new SetTasks([]));
  }
}
