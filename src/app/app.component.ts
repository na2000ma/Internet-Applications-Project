import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
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
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    this.stopOpenInspectOnRightClick();
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
}
