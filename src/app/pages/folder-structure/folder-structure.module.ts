import {CommonModule} from '@angular/common';
import {NgModule} from "@angular/core";
import {FolderStructureRoutingModule} from './folder-structure-routing.module';
import {NgxsModule} from "@ngxs/store";
import {HomePageComponent} from './components/home-page/home-page.component';
import {TreeComponent} from "@organizo/tree/components/tree.component";
import {DocumentsComponent} from './components/documents/documents.component';
import {RedrawOnDirective} from "@organizo/directives/redraw-on/redraw-on.directive";
import {OrganizoDrawerComponent} from "@organizo/components/drawer/drawer.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {TranslateModule} from "@ngx-translate/core";
import {AppFormsModule} from "@organizo/forms/app-forms.module";
import {FormlyModule} from "@ngx-formly/core";
import {MatStep, MatStepLabel, MatStepper} from "@angular/material/stepper";
import {
  DocumentContentComponent
} from "@app/pages/folder-structure/components/documents/document-content/document-content.component";
import {
  AddEditViewDocumentPropertiesDialogComponent
} from "@app/pages/folder-structure/components/add-edit-view-document-folder-dialog/add-edit-view-document-properties-dialog.component";
import {FoldersState} from "@app/pages/folder-structure/store/folders/folders.state";
import {DocumentsState} from "@app/pages/folder-structure/store/documents/documents.state";
import {SecurityClassState} from "@app/pages/security-template/store/class-security.state";
import {
  AddEditSecurityTemplateComponent
} from "@app/pages/security-template/components/add-edit-security-template/add-edit-security-template.component";
import {BreadcrumbComponent} from "@organizo/components/breadcrumb/breadcrumb.component";
import {PropertiesComponent} from "@app/pages/folder-structure/components/standalone/properties/properties.component";
import {
  DocumentVersionsComponent
} from "@app/pages/folder-structure/components/standalone/document-versions/document-versions.component";
import {
  DocumentFoldersFieldInComponent
} from "@app/pages/folder-structure/components/standalone/document-folders-field-in/document-folders-field-in.component";
import {
  ViewDocumentFolderPropertiesDialogComponent
} from '@app/pages/folder-structure/components/view-folder-document-properties-dialog/view-document-folder-properties-dialog.component';
import {
  CheckInDocumentDialogComponent
} from '@app/pages/folder-structure/components/documents/check-in-document-dialog/check-in-document-dialog.component';
import {
  DeleteDocumentDialogComponent
} from './components/documents/delete-document-dialog/delete-document-dialog.component';
import {RenameFolderDialogComponent} from './components/rename-folder-dialog/rename-folder-dialog.component';
import {
  SecurityTemplateClassComponent
} from "@app/pages/security-template/components/security-template-class/security-template-class.component";
import {DeleteFolderDialogComponent} from './components/delete-folder-dialog/delete-folder-dialog.component';
import {
  LunchWorkflowDialogComponent
} from "@app/pages/folder-structure/components/lunch-workflow-dialog/lunch-workflow-dialog.component";

@NgModule({
  declarations: [
    HomePageComponent,
    DocumentsComponent,
    DocumentContentComponent,
    AddEditViewDocumentPropertiesDialogComponent,
    ViewDocumentFolderPropertiesDialogComponent,
    CheckInDocumentDialogComponent,
    DeleteDocumentDialogComponent,
    RenameFolderDialogComponent,
    DeleteFolderDialogComponent,
    LunchWorkflowDialogComponent
  ],
  imports: [
    CommonModule,
    FolderStructureRoutingModule,
    NgxsModule.forRoot([
      FoldersState,
      DocumentsState,
      SecurityClassState
    ]),
    TreeComponent,
    RedrawOnDirective,
    OrganizoDrawerComponent,
    MatIcon,
    MatIconButton,
    MatTooltip,
    GridsModule,
    TranslateModule,
    AppFormsModule,
    FormlyModule,
    MatStep,
    MatStepLabel,
    MatStepper,
    AddEditSecurityTemplateComponent,
    BreadcrumbComponent,
    PropertiesComponent,
    DocumentVersionsComponent,
    DocumentFoldersFieldInComponent,
    MatMiniFabButton,
    SecurityTemplateClassComponent
  ],
})
export class FolderStructureModule {
}
