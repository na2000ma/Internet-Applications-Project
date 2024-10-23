import {Component, Inject} from '@angular/core';
import {DeleteDocumentForm} from "@app/pages/folder-structure/forms/delete-document.form";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {inject} from "@organizo/injector/app-injector";
import {OrganizoConfirmationService} from "@organizo/services/confirmation/confirmation.service";
import {get} from "lodash-es";
import {Store} from "@ngxs/store";
import {DeleteDocumentAction} from "@app/pages/folder-structure/store/documents/documents.actions";
import {ActivatedRoute} from "@angular/router";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";

@Component({
  selector: 'organizo-delete-document-dialog',
  templateUrl: './delete-document-dialog.component.html',
  styleUrl: './delete-document-dialog.component.scss'
})
export class DeleteDocumentDialogComponent extends UnsubscribeComponent {
  formDef: DeleteDocumentForm = new DeleteDocumentForm();

  constructor(
    private matDialogRef: MatDialogRef<DeleteDocumentDialogComponent>,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  get document() {
    return this.data;
  }

  get containerId() {
    return this.activatedRoute.snapshot.queryParams['containerId']
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  submit(model: any) {
    const title = 'Delete Document';

    const confirmation = inject(OrganizoConfirmationService).open({
      title: title,
      message: `Are you sure you want to remove this ${get(this.document, 'title')} ${get(model, 'fromAllContainers') ? ' from all containers' : ' from this container'}? This action cannot be undone!`,
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    let payload = {}

    if (get(model, 'fromAllContainers')) {
      payload = {
        objectId: get(this.document, 'objectId')
      }
    } else {
      payload = {
        documentId: get(this.document, 'objectId'),
        containerId: this.containerId
      }
    }

    this.subscriptions.add(
      confirmation.afterClosed().subscribe((result) => {
        if (result !== 'confirmed') {
          return;
        } else {
          // Delete API
          this.subscriptions.add(
            this.store.dispatch(new DeleteDocumentAction(payload, get(model, 'fromAllContainers'), this.containerId))
              .subscribe({
                complete: () => {
                  this.closeDialog();
                }
              })
          )
        }
      })
    )

  }
}
