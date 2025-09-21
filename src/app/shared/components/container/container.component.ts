import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerBorder = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {
  @Input() size: ContainerSize = 'full';
  @Input() padding: ContainerPadding = 'md';
  @Input() shadow: ContainerShadow = 'md';
  @Input() border: ContainerBorder = 'sm';
  @Input() rounded: boolean = true;
  @Input() centered: boolean = true;
  @Input() backgroundColor: string = 'bg-white dark:bg-gray-800';
  @Input() borderColor: string = 'border-gray-200 dark:border-gray-700';
  @Input() customClasses: string = '';

  getContainerClasses(): string {
    const classes = [];

    // Base classes
    classes.push('w-full');
    
    // Centering
    if (this.centered) {
      classes.push('mx-auto');
    }

    // Max width based on size
    switch (this.size) {
      case 'sm':
        classes.push('max-w-sm');
        break;
      case 'md':
        classes.push('max-w-md');
        break;
      case 'lg':
        classes.push('max-w-lg');
        break;
      case 'xl':
        classes.push('max-w-xl');
        break;
      case '2xl':
        classes.push('max-w-2xl');
        break;
      case '3xl':
        classes.push('max-w-3xl');
        break;
      case 'full':
        classes.push('max-w-full');
        break;
    }

    // Responsive Padding - only apply padding on sm breakpoint and above (not on mobile)
    switch (this.padding) {
      case 'none':
        break;
      case 'sm':
        classes.push('p-4');
        break;
      case 'md':
        classes.push('p-6');
        break;
      case 'lg':
        classes.push('p-8');
        break;
      case 'xl':
        classes.push('p-10');
        break;
    }

    // Shadow
    switch (this.shadow) {
      case 'none':
        break;
      case 'sm':
        classes.push('shadow-sm');
        break;
      case 'md':
        classes.push('shadow-md');
        break;
      case 'lg':
        classes.push('shadow-lg');
        break;
      case 'xl':
        classes.push('shadow-xl');
        break;
    }

    // Border
    if (this.border !== 'none') {
      classes.push('border');
      switch (this.border) {
        case 'sm':
          classes.push('border');
          break;
        case 'md':
          classes.push('border-2');
          break;
        case 'lg':
          classes.push('border-4');
          break;
      }
      classes.push(this.borderColor);
    }

    // Rounded corners
    if (this.rounded) {
      classes.push('rounded-lg');
    }

    // Background color
    classes.push(this.backgroundColor);

    // Custom classes
    if (this.customClasses) {
      classes.push(this.customClasses);
    }

    return classes.join(' ');
  }

  getResponsiveClasses(): string {
    return 'sm:p-6 md:p-8 lg:p-10 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl';
  }
}