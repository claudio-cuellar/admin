import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '@components/toast/toast.component';
import { ToastService } from 'app/shared/services/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container">
      <app-toast 
        *ngFor="let toast of toastService.toasts$ | async; trackBy: trackByToastId"
        [config]="toast"
        [visible]="toast.visible"
        (closed)="onToastClosed(toast.id)">
      </app-toast>
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  trackByToastId(index: number, toast: any): string {
    return toast.id;
  }

  onToastClosed(id: string): void {
    this.toastService.hide(id);
  }
}