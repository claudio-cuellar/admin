import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum',
  standalone: true,
  pure: false
})
export class SumPipe implements PipeTransform {
  transform<T>(items: T[], property: keyof T): number {
    if (!items || !property) {
      return 0;
    }
    
    return items.reduce((sum, item) => {
      const value = item[property];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  }
}