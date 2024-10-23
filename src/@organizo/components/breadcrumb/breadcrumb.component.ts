import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Crumb} from "@organizo/models/crumb";
import {Store} from "@ngxs/store";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {organizoAnimations} from "@organizo/animations/organizo.animations";
import {OrganizoMediaWatcherService} from "@organizo/services/media-watcher/media-watcher.service";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {GetPathActionByContainerId, SetIfCrumbClicked} from "@app/pages/folder-structure/store/folders/folders.actions";
import {GetDocumentsActionByContainerId} from "@app/pages/folder-structure/store/documents/documents.actions";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  standalone: true,
  imports: [
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatTooltip
  ],
  animations: organizoAnimations
})
export class BreadcrumbComponent extends UnsubscribeComponent implements OnInit {
  crumbs: Array<Crumb> = [];
  menuItems: Array<Crumb> = [];
  otherItems: Array<Crumb> = [];
  crumbsLineCount: number = 2;

  public type: string;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _organizoMediaWatcherService: OrganizoMediaWatcherService,
  ) {
    super();
  }

  @Input('type') set _type(value: string) {
    if (value) {
      this.type = value;
    } else {
      this.type = 'activeDirectory';
    }
    if (this.type === 'container') {
      this.subscriptions.add(
        this.store.select(FoldersState.path).subscribe((data: Crumb[]) => {
            this.crumbs = data;
            this.refreshData();
          }
        )
      );
    }

  }

  ngOnInit(): void {
    // Subscribe to media changes
    this.subscriptions.add(
      this._organizoMediaWatcherService.onMediaChange$
        .subscribe(({matchingAliases}) => {
          // Check if the screen is small
          if (matchingAliases.length === 0) {
            this.crumbsLineCount = 2;
          }
          if (matchingAliases.includes('sm')) {
            this.crumbsLineCount = 3;
          }
          if (matchingAliases.includes('md')) {
            this.crumbsLineCount = 4;
          }
          if (matchingAliases.includes('lg')) {
            this.crumbsLineCount = 6;
          }
          if (matchingAliases.includes('xl')) {
            this.crumbsLineCount = 8;
          }
          this.refreshData();
        })
    );
    this.subscriptions.add(
      this.store.select(FoldersState.path).subscribe((data: Crumb[]) => {
          this.crumbs = data;
          this.refreshData();
        }
      )
    );
  }

  refreshData() {
    this.crumbs = this.crumbs || [];
    this.menuItems = this.crumbs.slice(0, this.crumbs.length - this.crumbsLineCount)
    this.otherItems = this.crumbs.slice(Math.max(0, this.crumbs.length - this.crumbsLineCount));
  }

  getImgSrc(crumb: any) {
    if (crumb.type === 'organization') {
      return 'logo';
    } else if (crumb.type === 'folder') {
      return 'folder';
    } else if (crumb.type === 'group') {
      return 'group'
    } else return '';
  }

  select(crumb: Crumb, idx: number) {
    this.store.dispatch(new SetIfCrumbClicked(true));
    this.crumbs = this.crumbs.slice(0, idx + 1);
    const queryParams: any = {};
    if (this.type === 'activeDirectory') {
      if (crumb.type === 'group') {
        queryParams['groupId'] = crumb.id;
        queryParams['folderId'] = null;
      } else if (crumb.type === 'folder') {
        queryParams['folderId'] = crumb.id;
        queryParams['groupId'] = null;
      } else if (crumb.type === 'organization') {
        queryParams['folderId'] = null;
        queryParams['groupId'] = null;
      }
    } else if (this.type === 'container') {
      if (crumb.type === 'folder') {
        queryParams['containerId'] = crumb.id
        this.store.dispatch(new GetDocumentsActionByContainerId(crumb.id))
        this.store.dispatch(new GetPathActionByContainerId(crumb.id));
      }
    }
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          ...queryParams,
          dialog: null
        },
        queryParamsHandling: "merge"
      }
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
