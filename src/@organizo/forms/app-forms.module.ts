import {NgModule} from '@angular/core';
import {FORMLY_CONFIG, FormlyModule} from "@ngx-formly/core";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {appFormlyConfig} from "@organizo/forms/config/app-formly.config";
import {SharedModule} from "@shared/shared.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatStepperModule} from "@angular/material/stepper";
import {FormlyMaterialModule} from "@ngx-formly/material";
import {MatNativeDateModule, MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {FormlyMatDatepickerModule} from "@ngx-formly/material/datepicker";
import {FormlyMatToggleModule} from "@ngx-formly/material/toggle";
import {FormlyMatSliderModule} from "@ngx-formly/material/slider";
import {BaseFieldArrayComponent} from "@organizo/forms/components/fields/base-field-array.component";
import {BaseFieldComponent} from "@organizo/forms/components/fields/base-field.component";
import {AddonsFormlyWrapperComponent} from "@organizo/forms/components/wrappers/addons-formly-wrapper.component";
import {MatIcon} from "@angular/material/icon";
import {appFormlyConfigProvider} from "@organizo/forms/extensions/app-formly-config-provider";
import {
  FileUploaderFieldComponent
} from "@organizo/forms/components/fields/file-uploader-field/file-uploader-field.component";
import {DragDropDirective} from "@organizo/forms/directives/drag-drop.directive";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {ColumnWrapperComponent} from './components/wrappers/column-wrapper/column-wrapper.component';
import {RowWrapperComponent} from './components/wrappers/row-wrapper/row-wrapper.component';
import {AsyncPipe, NgClass, NgStyle} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {TreeComponent} from "@organizo/tree/components/tree.component";


@NgModule({
  declarations: [
    AddonsFormlyWrapperComponent,
    BaseFieldArrayComponent,
    BaseFieldComponent,
    FileUploaderFieldComponent,
    DragDropDirective,
    ColumnWrapperComponent,
    RowWrapperComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule.forChild(appFormlyConfig),
    FormlyMatDatepickerModule,
    FormlyMatToggleModule,
    FormlyMatSliderModule,

    MatButton,
    MatIcon,
    MatIconButton,
    MatExpansionModule,
    MatStepperModule,
    CdkDragHandle,
    CdkDrag,
    CdkDropList,
    NgClass,
    MatMiniFabButton,
    MatTooltip,
    AsyncPipe,
    MatFormField,
    MatInput,
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    NgStyle,


    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TreeComponent
  ],
  providers: [
    {provide: FORMLY_CONFIG, multi: true, useFactory: appFormlyConfigProvider, deps: [TranslateService]},
    provideNativeDateAdapter()
  ],
  exports: [
    SharedModule,
    ReactiveFormsModule,
    FormlyModule,

    MatButton,
    MatIcon,
    MatIconButton
  ]
})
export class AppFormsModule {
  constructor() {
  }
}
