import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // Auto-hide duration in milliseconds (0 = no auto-hide)
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  closable?: boolean;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" [class]="getPositionClasses()" class="fixed z-50 transition-all duration-300 ease-in-out">
      <div [class]="getToastClasses()" role="alert">
        <div [class]="getIconClasses()">
          <!-- Success Icon -->
          <svg *ngIf="config.type === 'success'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
          </svg>
          
          <!-- Error Icon -->
          <svg *ngIf="config.type === 'error'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
          </svg>
          
          <!-- Warning Icon -->
          <svg *ngIf="config.type === 'warning'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
          </svg>
          
          <!-- Info Icon -->
          <svg *ngIf="config.type === 'info'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          
          <span class="sr-only">{{ config.type }} icon</span>
        </div>
        
        <div class="ml-3 text-sm font-normal">
          <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ config.title }}</div>
          <div class="text-sm font-normal">{{ config.message }}</div>
        </div>
        
        <button *ngIf="config.closable !== false" type="button" (click)="close()" 
          class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
          aria-label="Close">
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() config: ToastConfig = {
    type: 'info',
    title: '',
    message: '',
    duration: 5000,
    position: 'top-right',
    closable: true
  };
  
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  private autoHideTimer?: number;

  ngOnInit(): void {
    if (this.visible && this.config.duration && this.config.duration > 0) {
      this.startAutoHideTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoHideTimer();
  }

  show(): void {
    this.visible = true;
    this.visibleChange.emit(true);
    
    if (this.config.duration && this.config.duration > 0) {
      this.startAutoHideTimer();
    }
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.closed.emit();
    this.clearAutoHideTimer();
  }

  private startAutoHideTimer(): void {
    this.clearAutoHideTimer();
    this.autoHideTimer = window.setTimeout(() => {
      this.close();
    }, this.config.duration);
  }

  private clearAutoHideTimer(): void {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = undefined;
    }
  }

  getPositionClasses(): string {
    const positions = {
      'top-right': 'top-5 right-5',
      'top-left': 'top-5 left-5',
      'bottom-right': 'bottom-5 right-5',
      'bottom-left': 'bottom-5 left-5',
      'top-center': 'top-5 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-5 left-1/2 transform -translate-x-1/2'
    };
    
    return positions[this.config.position || 'top-right'];
  }

  getToastClasses(): string {
    const baseClasses = 'flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800';
    
    const typeClasses = {
      'success': 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
      'error': 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
      'warning': 'text-yellow-500 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200',
      'info': 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200'
    };
    
    return `${baseClasses} ${typeClasses[this.config.type]}`;
  }

  getIconClasses(): string {
    const iconClasses = {
      'success': 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200',
      'error': 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200',
      'warning': 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-yellow-500 bg-yellow-100 rounded-lg dark:bg-yellow-800 dark:text-yellow-200',
      'info': 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200'
    };
    
    return iconClasses[this.config.type];
  }
}