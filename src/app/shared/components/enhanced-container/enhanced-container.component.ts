import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContainerConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  centered?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'app-enhanced-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="getContainerClasses()"
      [attr.role]="clickable ? 'button' : 'region'"
      [attr.tabindex]="clickable ? '0' : null"
      (click)="onContainerClick()"
      (keydown.enter)="onContainerClick()"
      (keydown.space)="onContainerClick()">
      
      <!-- Loading Overlay -->
      <div *ngIf="config.loading" class="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center rounded-lg z-10">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
      
      <!-- Content -->
      <div [class.opacity-50]="config.loading" [class.pointer-events-none]="config.loading">
        <ng-content></ng-content>
      </div>
    </div>
  `,
//   styleUrls: ['./enhanced-container.component.css']
})
export class EnhancedContainerComponent {
  @Input() config: ContainerConfig = {};
  @Input() customClasses: string = '';
  @Output() containerClick = new EventEmitter<void>();

  get clickable(): boolean {
    return this.config.clickable || false;
  }

  onContainerClick(): void {
    if (this.clickable && !this.config.loading) {
      this.containerClick.emit();
    }
  }

  getContainerClasses(): string {
    const classes = ['relative', 'w-full'];
    const config = { ...this.getDefaultConfig(), ...this.config };

    // Centering
    if (config.centered) {
      classes.push('mx-auto');
    }

    // Size
    classes.push(this.getSizeClass(config.size!));

    // Padding
    classes.push(this.getPaddingClass(config.padding!));

    // Shadow
    classes.push(this.getShadowClass(config.shadow!));

    // Border
    if (config.border !== 'none') {
      classes.push('border', this.getBorderClass(config.border!), 'border-gray-200', 'dark:border-gray-700');
    }

    // Rounded
    if (config.rounded) {
      classes.push('rounded-lg');
    }

    // Background
    classes.push('bg-white', 'dark:bg-gray-800');

    // Interactive states
    if (config.hoverable) {
      classes.push('hover:shadow-lg', 'transition-shadow', 'duration-200');
    }

    if (config.clickable) {
      classes.push('cursor-pointer', 'hover:bg-gray-50', 'dark:hover:bg-gray-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-opacity-50');
    }

    // Responsive classes
    classes.push('sm:p-4', 'md:p-6', 'lg:p-8');

    // Custom classes
    if (this.customClasses) {
      classes.push(this.customClasses);
    }

    return classes.join(' ');
  }

  private getDefaultConfig(): ContainerConfig {
    return {
      size: 'full',
      padding: 'md',
      shadow: 'md',
      border: 'sm',
      rounded: true,
      centered: true,
      hoverable: false,
      clickable: false,
      loading: false
    };
  }

  private getSizeClass(size: string): string {
    const sizeMap: { [key: string]: string } = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      'full': 'max-w-full'
    };
    return sizeMap[size] || 'max-w-full';
  }

  private getPaddingClass(padding: string): string {
    const paddingMap: { [key: string]: string } = {
      'none': '',
      'sm': 'p-4',
      'md': 'p-6',
      'lg': 'p-8',
      'xl': 'p-10'
    };
    return paddingMap[padding] || 'p-6';
  }

  private getShadowClass(shadow: string): string {
    const shadowMap: { [key: string]: string } = {
      'none': '',
      'sm': 'shadow-sm',
      'md': 'shadow-md',
      'lg': 'shadow-lg',
      'xl': 'shadow-xl'
    };
    return shadowMap[shadow] || 'shadow-md';
  }

  private getBorderClass(border: string): string {
    const borderMap: { [key: string]: string } = {
      'sm': 'border',
      'md': 'border-2',
      'lg': 'border-4'
    };
    return borderMap[border] || 'border';
  }
}

//  Enhanced Container with Loading 
//     <app-enhanced-container [config]="{
//       size: 'xl',
//       padding: 'lg',
//       shadow: 'lg',
//       hoverable: true,
//       loading: true
//     }" class="mt-8">
//         <form class="space-y-6">
            
//         </form>
//     </app-enhanced-container>
    

// <app-enhanced-container [config]="{
//       size: 'md',
//       padding: 'md',
//       shadow: 'md',
//       clickable: true,
//       hoverable: true
//     }" (containerClick)="onCardClick()" class="mt-4">
//         <div class="text-center">
//             <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Action</h3>
//             <p class="text-gray-600 dark:text-gray-400 mt-2">Click to perform action</p>
//         </div>
//     </app-enhanced-container>