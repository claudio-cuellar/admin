import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '@services/menu/menu.service';
import { MenuSection } from '@models/menu.model';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() open = false;
  
  private menuService = inject(MenuService);
  menuSections: MenuSection[] = [];
  expandedItems: Set<string> = new Set();

  ngOnInit() {
    this.menuSections = this.menuService.getMenuSections();
  }

  toggleSubmenu(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }
}