import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastConfig, ToastType } from '@components/toast/toast.component';

export interface Toast extends ToastConfig {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  show(config: Partial<ToastConfig>): string {
    const toast: Toast = {
      id: this.generateId(),
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      duration: config.duration !== undefined ? config.duration : 5000,
      position: config.position || 'top-right',
      closable: config.closable !== false,
      visible: true
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto-hide if duration is set
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.hide(toast.id);
      }, toast.duration);
    }

    return toast.id;
  }

  hide(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  hideAll(): void {
    this.toastsSubject.next([]);
  }

  // Convenience methods
  success(title: string, message: string, duration?: number): string {
    return this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration?: number): string {
    return this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration?: number): string {
    return this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration?: number): string {
    return this.show({ type: 'info', title, message, duration });
  }
}