import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {AppToast} from "@organizo/services/toast-service/toast.types";


@Injectable({
  providedIn: 'root'
})
export class ToastService implements OnDestroy {
  subscription = new Subscription()
  snackBarQueue: AppToast[] = [];
  isSnakeBarShown = false;
  snackBarRef: any;

  constructor(private snackBar: MatSnackBar, private zone: NgZone) {
  }

  push(data: AppToast) {
    this.snackBarQueue.push(data);
    if (!this.isSnakeBarShown) {
      this.showNext();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  private showNext() {
    const data = this.snackBarQueue.shift();
    if (data) {
      this.isSnakeBarShown = true;
      this.zone.run(() => {
        this.snackBarRef = this.snackBar.open(data.message, data.action, data.config);
        this.subscription.add(
          this.snackBarRef.afterDismissed().subscribe(() => {
            this.isSnakeBarShown = false;
            this.showNext();
          })
        );
      });
    }
  }
}
