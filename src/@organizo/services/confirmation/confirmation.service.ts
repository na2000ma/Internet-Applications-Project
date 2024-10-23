import {inject, Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {merge} from 'lodash-es';
import {OrganizoConfirmationConfig} from "@organizo/services/confirmation/confirmation.types";
import {OrganizoConfirmationDialogComponent} from "@organizo/services/confirmation/dialog/dialog.component";

@Injectable({providedIn: 'root'})
export class OrganizoConfirmationService {
  private _matDialog: MatDialog = inject(MatDialog);
  private _defaultConfig: OrganizoConfirmationConfig = {
    title: 'Confirm action',
    message: 'Are you sure you want to confirm this action?',
    icon: {
      show: true,
      name: 'organizo-outline-icons:exclamation-triangle',
      color: 'warn',
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirm',
        color: 'warn',
      },
      cancel: {
        show: true,
        label: 'Cancel',
      },
    },
    dismissible: true
  };

  /**
   * Constructor
   */
  constructor() {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  open(config: OrganizoConfirmationConfig = {}): MatDialogRef<OrganizoConfirmationDialogComponent> {
    // Merge the user config with the default config
    const userConfig = merge({}, this._defaultConfig, config);

    // Open the dialog
    return this._matDialog.open(OrganizoConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: 'organizo-confirmation-dialog-panel',
    });
  }
}
