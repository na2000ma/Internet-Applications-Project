import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {AppState} from "@app/store/app.state";
import {NavigationStart, Router} from "@angular/router";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";
import {DOCUMENT} from "@angular/common";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends UnsubscribeComponent implements OnInit, AfterViewChecked {
  title = 'Organizo';

  loading: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store,
    private router: Router,
    private objectUtilsService: ObjectUtilsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    this.stopOpenInspectOnRightClick();
    this.startLoaderWhenLoadModule();
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }


  stopOpenInspectOnRightClick() {
    this.document.addEventListener('contextmenu', (event: Event) => {
      event.preventDefault();
    });
  }

  startLoaderWhenLoadModule() {
    this.subscriptions.add(
      this.router.events.subscribe(e => {
        if (e instanceof NavigationStart) {
          this.objectUtilsService.startLoader();
        } else {
          return;
        }
      })
    )

    // don't remove setInterval because the splash screen is appeared when I refresh the page
    this.subscriptions.add(
      this.store.select(AppState.loading).subscribe(data => {
        this.loading = data;
        setInterval(() => {
          this.loading = true;
        }, 1000)
      })
    )
  }
}
