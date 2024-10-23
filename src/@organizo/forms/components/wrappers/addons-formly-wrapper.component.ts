import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-addons',
  template: `
    <ng-template #matPrefix>
      <div class="flex items-center justify-between">
        @if (props.addonLeft) {
          <span [ngStyle]="{ cursor: props.addonLeft.onClick ? 'pointer' : 'inherit' }"
                (click)="addonLeftClick($event)">
        @if (props.addonLeft.icon) {
          <mat-icon>{{ props.addonLeft.icon }}</mat-icon>
        }
            @if (props.addonLeft.text) {
              <span>{{ props.addonLeft.text }}</span>
            }
      </span>
        }
      </div>
    </ng-template>

    <ng-container #fieldComponent></ng-container>

    <div class="flex items-center justify-between">
      <ng-template #matSuffix>
        @if (props.addonRight) {
          <span [ngStyle]="{ cursor: props.addonRight.onClick ? 'pointer' : 'inherit' }"
                (click)="addonRightClick($event)">
        @if (props.addonRight.icon) {
          <mat-icon>{{ props.addonRight.icon }}</mat-icon>
        }
            @if (props.addonRight.text) {
              <span>{{ props.addonRight.text }}</span>
            }
      </span>
        }
      </ng-template>
    </div>
  `,
})
export class AddonsFormlyWrapperComponent extends FieldWrapper implements AfterViewInit {
  @ViewChild('matPrefix', {static: true}) matPrefix!: TemplateRef<any>;
  @ViewChild('matSuffix', {static: true}) matSuffix!: TemplateRef<any>;

  ngAfterViewInit() {
    if (this.matPrefix) {
      this.props.prefix = this.matPrefix;
    }

    if (this.matSuffix) {
      this.props.suffix = this.matSuffix;
    }
  }

  addonRightClick($event: any) {
    if (this.props.addonRight.onClick) {
      this.props.addonRight.onClick(this.to, this, $event);
    }
  }

  addonLeftClick($event: any) {
    if (this.props.addonLeft.onClick) {
      this.props.addonLeft.onClick(this.to, this, $event);
    }
  }
}
